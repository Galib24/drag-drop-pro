import { useState, useEffect } from 'react';
import { AiOutlinePicture } from 'react-icons/ai';
import './App.css';

function App() {
  const [dates, setDates] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [savedImagesCount, setSavedImagesCount] = useState(0);
  const [selectedForDeletionCount, setSelectedForDeletionCount] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0); // Initialize the counter

  // drag and drop part
  const [draggedImage, setDraggedImage] = useState(null);

  const handleDragStart = (e, picture) => {
    setDraggedImage(picture);
    e.dataTransfer.setData('text/plain', ''); // Required for Firefox to enable drag-and-drop
  };

  const handleDragEnter = (e, picture) => {
    e.preventDefault();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, picture) => {
    e.preventDefault();

    if (draggedImage !== picture) {
      const updatedDates = [...dates];
      const draggedIndex = updatedDates.indexOf(draggedImage);
      const dropIndex = updatedDates.indexOf(picture);

      updatedDates[draggedIndex] = picture;
      updatedDates[dropIndex] = draggedImage;

      setDates(updatedDates);
    }

    setDraggedImage(null);
  };

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

  const handleImageSelection = (picture) => {
    // Toggle the selected state of the image
    picture.selected = !picture.selected;
    setDates([...dates]);

    // Update the counter
    setSelectedCount((prevCount) => (picture.selected ? (prevCount + 1) : prevCount === null ? null : prevCount - 1));
  };




  return (
    <section className='container   ml-16 pr-52 pl-52 shadow-lg rounded-xl'>

      {/* <p>Number of saved images: {savedImagesCount}</p> */}

      {/* nav bar */}
      <div style={{ border: '1px solid black' }}
        className='bg-white w-auto h-10 navbar overflow-clip '>
        <div className='navbar-start'>
          <input type="checkbox" className=" checkbox checkbox-sm mt-2 checkbox-info " disabled checked />
          {selectedCount !== null && selectedCount > 0 && <p>{selectedCount} Files Selected </p>}


          {selectedForDeletionCount && <p>Files Selected  </p>}

        </div>


        <div className='navbar-end overflow-clip'>
          {selectedImages.some((image) => image.selected) && (
            <button className='btn w-fit bg-white text-red-500 hover:bg-red-800 hover:text-white' onClick={deleteSelectedImages}>
              Delete Files</button>
          )}
          {dates.some((picture) => picture.selected) && (
            <button className='btn  w-fit bg-white text-red-500 hover:bg-red-800 hover:text-white' onClick={selectAndDeleteImagesFromDates}>
              Delete Files
            </button>
          )}
        </div>
      </div>




      {/* <p>Selected for deletion: </p> */}
      {/* <p>Number of images selected for deletion: </p> */}
      <div className="images grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-3">
        {selectedImages.map((image, index) => (
          <div key={index}
            className={`relative rounded-md group cursor-pointer `}
            style={{
              marginTop: '10px',
              width: '150px',
              height: '150px',
              transition: 'transform 0.3s, box-shadow 0.3s', // Add transitions for smooth effects
              transform: `scale(${draggedImage === image ? 1.1 : 1})`, // Apply scale transformation
              boxShadow: draggedImage === image ? '0px 10px 20px rgba(0, 0, 0, 0.2)' : '0px 0px 0px rgba(0, 0, 0, 0)', // Apply drop shadow
           

            }}
            draggable
            onDragStart={(e) => handleDragStart(e, picture)}
            onDragEnter={(e) => handleDragEnter(e, picture)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, picture)}
          >
            <div className="absolute rounded-md inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
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

        {dates?.map((picture, index) => (
          <div
            key={picture.id}

            className={`relative rounded-md group cursor-pointer ${picture.selected ? 'bg-white' : 'bg-white'} `}
            style={{
              marginTop: '10px',
              width: '150px',
              height: '150px',
              transition: 'transform 0.3s, box-shadow 0.3s', // Add transitions for smooth effects
              transform: `scale(${draggedImage === picture ? 1.1 : 1})`, // Apply scale transformation
              boxShadow: draggedImage === picture ? '0px 10px 20px rgba(0, 0, 0, 0.2)' : '0px 0px 0px rgba(0, 0, 0, 0)', // Apply drop shadow
              ...(index === 0 ? { width: '280px', height: '280px', marginRight: '20px' } : {}),
              ...(index === 1 ? { marginLeft: '100px' } : {}),
              ...(index === 2 ? { marginLeft: '70px' } : {}),
              ...(index === 3 ? { marginLeft: '40px' } : {}),

            }}
            draggable
            onDragStart={(e) => handleDragStart(e, picture)}
            onDragEnter={(e) => handleDragEnter(e, picture)}
            onDragOver={(e) => handleDragOver(e)}
            onDrop={(e) => handleDrop(e, picture)}

          >
            <div className="absolute rounded-md inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"></div>
            <img
              src={picture.url}
              alt=""
              className="transition-opacity duration-300 ease-in-out hover:opacity-50 w-full"
            />
            <input
              type="checkbox"
              checked={picture.selected}
              onChange={() => handleImageSelection(picture)}
              className="absolute top-2 right-2 z-10 cursor-pointer"
            />
          </div>
        ))}

        <label style={{ width: '150px', height: '150px' }} className="custom-file-input rounded-md">
          <span>

            <center>
              <AiOutlinePicture></AiOutlinePicture>
            </center>
          </span>
          Add Images
          <br />

          <input
            type="file"
            name="images"
            onChange={onSelectFile}
            multiple
            accept="image/png, image/jpeg, image/webp"
          />
        </label>
      </div>


    </section>
  );
}

export default App;




// style={{ width: '200px', height: '200px', ...(index === 0 ? { width: '370px', height: '370px' } : {}) }}