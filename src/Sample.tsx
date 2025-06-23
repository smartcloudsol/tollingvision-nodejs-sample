import {
  useState,
  useEffect,
  useCallback,
  createRef,
  ChangeEvent,
} from "react";
import {
  TollingVisionServiceClient,
  Image as InputImage,
  SearchRequest,
  SearchResponse,
  Status,
  Vehicle,
  Plate,
  Mmr,
} from "@smart-cloud/tollingvision";

/*
Create a client instance.
The only required parameter is the address of the Tolling Vision dockerized service or a load-balancer in front of it in a clustered environment, 
in the format PROTOCOL://HOST[:PORT]. 
Here, HOST is the hostname or IP address and the optional PORT is the exposed TCP port of the application, e.g., http://127.0.0.1:8080.
*/
const client = new TollingVisionServiceClient("http://localhost");

function Sample() {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState<string>();
  const [error, setError] = useState<string>();
  const [result, setResult] = useState<Vehicle[]>();
  const [status, setStatus] = useState<Status | string>();

  const fileRef = createRef<HTMLInputElement>();

  // The search function, which is activated by pressing the `Search` button, sends the selected image to the application and receives the search results.
  const search = useCallback(async () => {
    if (!selectedFile) {
      setError("Select an image to search.");
      return;
    }
    // Clearing the previous result
    setResult(undefined);
    setError(undefined);
    // Create a search request
    const searchRequest = new SearchRequest();
    // Enable make and model recognition
    searchRequest.setMakeAndModelRecognition(true);
    // Set image name and bytes
    const buff: ArrayBuffer = await selectedFile.arrayBuffer();
    const img = new InputImage();
    img.setData(new Uint8Array(buff));
    img.setName(selectedFile.name);
    searchRequest.setImage(img);
    console.log("Sending", selectedFile.name);
    // Send the request to the application
    const call = client.search(searchRequest);
    setStatus("Uploading...");
    // Handle the response
    call.on("data", (response: SearchResponse) => {
      setStatus(response.getStatus());
      switch (response.getStatus()) {
        case Status.QUEUEING:
          console.log("Request queued.");
          break;
        case Status.PROCESSING:
          console.log("Request processing.");
          break;
        case Status.RESULT:
          console.log("Search result:", response.getResultList());
          setResult(response.getResultList());
          break;
      }
    });

    call.on("end", () => {
      console.log("Search ended.");
      setStatus(undefined);
    });

    call.on("error", (err) => {
      console.error("Search error:", err);
      setStatus(undefined);
      setError(err.message);
    });
  }, [selectedFile]);

  // Clear the image and the result
  const clearImage = useCallback(() => {
    setStatus(undefined);
    setResult(undefined);
    setError(undefined);
    setSelectedFile(undefined);
    setImageUrl(undefined);
  }, []);

  // Check if the uploaded file is a valid image (JPG or PNG)
  const isImageValid = useCallback((file: File) => {
    return file.type === "image/jpeg" || file.type === "image/png";
  }, []);

  // Get the status text of the search process
  const getStatusText = useCallback((): string | Status.RESULT | undefined => {
    switch (status) {
      case Status.QUEUEING:
        return "Queueing...";
      case Status.PROCESSING:
        return "Processing...";
      default:
        return status;
    }
  }, [status]);

  // Get the file name
  const getFileName = useCallback((): string => {
    let name = selectedFile?.name || "";
    if (name.length > 17) {
      name = name.substring(0, 3) + "..." + name.substring(name.length - 11);
    }

    return name;
  }, [selectedFile]);

  // Get the image URL
  const getImageUrl = useCallback((file: File): Promise<string> => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  // Render the plate text with additional information from the plate object
  const renderPlate = useCallback((plate: Plate) => {
    let result = plate.getText() || "-";
    if (plate.getCountry()) {
      result += " | " + plate.getCountry() + " " + plate.getState();
    }
    if (plate.getCategory()) {
      result += " | " + plate.getCategory();
    }
    if (plate.getConfidence()) {
      result +=
        " | " +
        plate.getConfidence() +
        "%" +
        " (text: " +
        plate.getTextConfidence() +
        "%, state: " +
        plate.getPlateTypeConfidence() +
        "%)";
    }
    return result;
  }, []);

  // Render the make and model with additional information from the mmr object
  const renderMmr = useCallback((mmr: Mmr) => {
    let makeAndModel = "???";
    if (mmr.getMake()) {
      makeAndModel = mmr.getMake();
      if (mmr.getModel()) {
        makeAndModel += " " + mmr.getModel();
        if (mmr.getGeneration()) {
          makeAndModel += " " + mmr.getGeneration();
        }
      }
    }
    let additionalInfo = mmr.getColorName()?.toLowerCase();

    let color = null;
    if (mmr.getCategory()) {
      color = mmr.getCategory().toLowerCase().replace(/_/, "-");
    }
    if (color) {
      additionalInfo = (additionalInfo ? additionalInfo + ", " : "") + color;
    }

    let bodyType = null;
    if (mmr.getBodyType()) {
      bodyType = mmr.getBodyType().toLowerCase();
    }
    if (bodyType) {
      additionalInfo = (additionalInfo ? additionalInfo + ", " : "") + bodyType;
    }

    let viewPoint = null;
    if (mmr.getViewPoint()) {
      viewPoint = mmr.getViewPoint().toLowerCase().replace(/_/, "-");
    }
    if (viewPoint) {
      additionalInfo =
        (additionalInfo ? additionalInfo + ", " : "") + viewPoint;
    }

    let dimensions = null;
    if (mmr.getDimensions()) {
      dimensions =
        "width: " +
        mmr.getDimensions()?.getWidth() +
        "mm, " +
        "height: " +
        mmr.getDimensions()?.getHeight() +
        "mm, " +
        "length: " +
        mmr.getDimensions()?.getLength() +
        "mm";
    }
    if (dimensions) {
      additionalInfo =
        (additionalInfo ? additionalInfo + ", " : "") + dimensions;
    }

    if (additionalInfo) {
      return makeAndModel + " (" + additionalInfo + ")";
    }
    return makeAndModel;
  }, []);

  // Handle the image change event
  const imageChanged = useCallback(
    async (event: ChangeEvent<HTMLInputElement> | null) => {
      clearImage();
      const imageFile = event?.target?.files?.length
        ? event.target.files[0]
        : null;
      if (imageFile) {
        if (isImageValid(imageFile)) {
          await getImageUrl(imageFile);
          setSelectedFile(imageFile);
        } else {
          setError("You can upload JPG/PNG file only!");
        }
      }
    },
    [clearImage, isImageValid, getImageUrl]
  );

  // Load the image URL when the selected file changes
  useEffect(() => {
    if (selectedFile) {
      getImageUrl(selectedFile).then((url) => setImageUrl(url));
    }
  }, [getImageUrl, selectedFile]);

  return (
    <>
      <h1>Tolling Vision Sample</h1>
      <div className="card">
        <label htmlFor="photo" className="custom-file-upload">
          {imageUrl ? "Change image" : "Select an image"}
        </label>
        <input
          style={{ width: "1px", height: "1px" }}
          accept="image/*"
          id="photo"
          type="file"
          onChange={imageChanged}
          ref={fileRef}
        />
      </div>
      {imageUrl && (
        <div className="card">
          <img
            src={imageUrl}
            alt="Clear image"
            title="Clear image"
            onClick={() => {
              clearImage();
              if (fileRef.current) {
                fileRef.current.value = "";
              }
            }}
            style={{
              width: "516px",
              maxWidth: "100%",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          />
          {getFileName()}
        </div>
      )}
      <div className="card">
        <button
          onClick={search}
          disabled={!selectedFile || (status && !result) || undefined}
        >
          Search
        </button>
      </div>
      <div className="error">{error}</div>
      {status && status !== Status.RESULT && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="loader">
            <svg className="circular">
              <circle
                className="path"
                cx="40"
                cy="40"
                r="20"
                fill="none"
                strokeWidth="5"
                strokeMiterlimit="10"
              ></circle>
            </svg>
          </div>
          <p>{getStatusText()}</p>
        </div>
      )}
      {result && (
        <div className="result">
          {result.map((vehicle, idx) => {
            return (
              <div key={idx}>
                {
                  <p className="result-item">
                    {vehicle.getPlate()
                      ? renderPlate(vehicle.getPlate() as Plate) +
                        (vehicle.getAlternativeList()?.length
                          ? ", possible alternatives:"
                          : "")
                      : "No plate was recognized"}
                  </p>
                }
                {vehicle.getAlternativeList() && (
                  <ul>
                    {vehicle.getAlternativeList().map((plate, idx) => (
                      <li key={idx}>{renderPlate(plate)}</li>
                    ))}
                  </ul>
                )}
                {vehicle.getMmr() && (
                  <p className="result-item">
                    {renderMmr(vehicle.getMmr() as Mmr)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

export default Sample;
