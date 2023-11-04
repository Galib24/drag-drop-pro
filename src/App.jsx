import { useState, useEffect } from 'react';

import './App.css';

function App() {
  const [dates, setDates] = useState([]);
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

  useEffect(() => {
    fetch('data.json')
      .then(res => res.json())
      .then(data => setDates(data))
  }, [])
  console.log(dates);
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


  const selectAndDeleteImagesFromDates = () => {
    const updatedDates = dates.filter((picture) => !picture.selected);

    // Update the 'dates' state with the remaining images
    setDates(updatedDates);

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
      {selectedImages.some((image) => image.selected) && (
        <button className='btn bg-red-400' onClick={deleteSelectedImages}>Delete Selected Images</button>
      )}
      {dates.some((picture) => picture.selected) && (
        <button className='btn bg-red-400' onClick={selectAndDeleteImagesFromDates}>
          Delete Selected Images from Dates
        </button>
      )}

      <p>Number of images selected for deletion: {selectedForDeletionCount}</p>
      <div className="images grid grid-cols-4">
        {selectedImages.map((image, index) => (
          <div key={index} className="relative group">
            <img
              
              src={image.url}
              alt=""
              className="transition-opacity duration-300 ease-in-out group-hover:opacity-50 cursor-pointer"
            />
            <input
              type="checkbox"
              checked={image.selected}
              onChange={() => toggleImageSelection(index)}
              className="absolute top-2 right-2 hidden group-hover:block cursor-pointer"
            />
          </div>
        ))}

        {dates?.map((picture) => (
          <div
            key={picture.id}
            className={`relative group cursor-pointer ${picture.selected ? 'bg-white' : 'bg-white'
              }`}
          >
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
            <img
              src={picture.url}
              alt=""
              className="transition-opacity duration-300 ease-in-out hover:opacity-50 w-full"
            />
            <input
              type="checkbox"
              checked={picture.selected}
              onChange={() => {
                // Toggle the selected state of the image
                picture.selected = !picture.selected;
                setDates([...dates]);

              }}
              className="absolute top-2 right-2 z-10 cursor-pointer"
            />
          </div>
        ))}




      </div>
    </section>
  );
}

export default App;
