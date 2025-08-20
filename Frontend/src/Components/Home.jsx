import React, { useState } from "react";
import { BsFileEarmarkWordFill } from "react-icons/bs";
import axios from "axios";

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [convert, setConvert] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  const API_URL = process.env.NODE_ENV === "production"
    ? "https://document-convertor-2.onrender.com/convertFile"
    : "http://localhost:3001/convertFile";

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setConvert("Please Select a File");
      setShowMessage(true);
      hideMessage();
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(API_URL, formData, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        selectedFile.name.replace(/\.[^/.]+$/, "") + ".pdf"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      document.getElementById("FileInput").value = "";
      setSelectedFile(null);
      setDownloadError("");
      setConvert("File Converted Successfully");
      setShowMessage(true);
      hideMessage();
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 400) {
        setDownloadError("Error Occurred: " + error.response.data.message);
      } else {
        setConvert("");
      }
    }
  };

  const hideMessage = () => {
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  return (
    <div className="max-w-screen-2xl mx-auto container px-6 py-3 md:px-40">
      <div className="flex h-screen items-center justify-center">
        <div className="border-2 border-dashed px-4 py-6 md:px-8 border-indigo-500 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-4">
            Convert Word file into PDF
          </h1>
          <p className="text-sm text-center mb-5">
            Easy to convert .docx file into .pdf file format without any other
            software
          </p>

          <div className="flex flex-col items-center space-y-4">
            <input
              type="file"
              accept=".doc, .docx"
              className="hidden"
              onChange={handleFileChange}
              id="FileInput"
            />
            <label
              htmlFor="FileInput"
              className="w-full flex items-center justify-center px-4 py-6 bg-gray-100 text-gray-700 rounded-lg shadow-lg 
              cursor-pointer border-blue-300 hover:bg-blue-700 duration-300 hover:text-white"
            >
              <BsFileEarmarkWordFill className="text-3xl mr-3" />
              <span className="text-2xl mr-2 font-semibold">
                {selectedFile ? selectedFile.name : "Choose File"}
              </span>
            </label>
            <button
              onClick={handleSubmit}
              className={`text-white bg-blue-500 hover:bg-blue-900 duration-300 px-4 py-2 
              font-bold rounded-lg disabled:bg-slate-300 ${
                !selectedFile ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!selectedFile}
            >
              Convert File
            </button>

            {showMessage && convert && (
              <div className="text-green-500 text-center mt-4">{convert}</div>
            )}

            {downloadError && (
              <div className="text-red-500 text-center">{downloadError}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
