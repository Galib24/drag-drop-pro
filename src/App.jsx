import { useState, useEffect } from 'react';

import './App.css';

function App() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [savedImagesCount, setSavedImagesCount] = useState(0);
  const [selectedForDeletionCount, setSelectedForDeletionCount] = useState(0);



  useEffect(() => {
    // When the component mounts, retrieve the selected images from local storage
    const storedImages = localStorage.getItem('selectedImages');
    if (storedImages) {
      const imagesArray = JSON.parse(storedImages);
      setSelectedImages(imagesArray);
      setSavedImagesCount(imagesArray.length);
    }
  }, []);

  const onSelectFile = (e) => {
    const selectedFiles = e.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    const imagesArray = selectedFilesArray.map((file) => {
      return { url: URL.createObjectURL(file), selected: false };
    });

    // Update state with the selected images
    setSelectedImages([...selectedImages, ...imagesArray]);

    // Save the updated selected images to local storage
    const updatedImages = [...selectedImages, ...imagesArray];
    localStorage.setItem('selectedImages', JSON.stringify(updatedImages));

    // Update the saved images count
    setSavedImagesCount(updatedImages.length);
  };

  const toggleImageSelection = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages[index].selected = !updatedImages[index].selected;
    setSelectedImages(updatedImages);

    const selectedCount = updatedImages.filter((image) => image.selected).length;
    setSelectedForDeletionCount(selectedCount);


  };

  const deleteSelectedImages = () => {
    const updatedImages = selectedImages.filter((image) => !image.selected);




    // Update state with the remaining images
    setSelectedImages(updatedImages);

    // Update local storage with the remaining images
    localStorage.setItem('selectedImages', JSON.stringify(updatedImages));

    // Update the saved images count
    setSavedImagesCount(updatedImages.length);

    // Update the selectedForDeletionCount
    setSelectedForDeletionCount(0);

  };


  return (
    <section>
      <label className="custom-file-input">
        *Add Images
        <br />
        <span>Up to 10 images</span>
        <input
          type="file"
          name="images"
          onChange={onSelectFile}
          multiple
          accept="image/png, image/jpeg, image/webp"
        />
      </label>
      <p>Number of saved images: {savedImagesCount}</p>

      <p>Number of images selected for deletion: {selectedForDeletionCount}</p>
      <div className="images">
        {selectedImages.map((image, index) => (
          <div key={index} className="image">
            <img src={image.url} alt="" />
            <input
              type="checkbox"
              checked={image.selected}
              onChange={() => toggleImageSelection(index)}
            />
          </div>
        ))}
      </div>

      {selectedImages.some((image) => image.selected) && (
        <button onClick={deleteSelectedImages}>Delete Selected Images</button>
      )}
    </section>
  );
}

export default App;
