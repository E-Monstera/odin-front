import { useState, useContext } from 'react';
import { UserContext } from '../../App';
import { updateCover, updateProfile } from '../../services/user.service'

function NewImg(props) {

    // Grab UserContext from app.js and destructure currentUser from it
    const userContext = useContext(UserContext);
    const { currentUser } = userContext;

    // State to hold the new image and any associated errors
    const [image, setImage] = useState(null);
    const [error, setError] = useState('');

    // Function to control input for a new user
    const handleChange = (e) => {
        setImage(e.target.files[0])
    }

    //Function to handle submitting the image to the database
    const handleSubmit = (e) => {
        e.preventDefault();

        //If props.cover===true, the image is for a cover image
        if(image === null) {
            setError('Please select an image')
        } else if (props.cover) {
            // Clear error and Update the users cover photo
            setError('');
            updateCover(image, currentUser.id)
            .then(response => {              
                //Update currentUser in context
                userContext.userDispatch({ type: 'updateUser', payload: {cover:response.data.cover_img }})
                props.updateProfile({cover:response.data.cover_img});   //Trigger a profile page update
                props.closeModal();     //Closes the newImg modal
            })
            .catch(error => {
                console.log(error)
            })
        } else {
            //if props.cover===false, the image is for a profile image
            //Clear the error and update the users profile image
            setError('');
            updateProfile(image, currentUser.id)
            .then(response => {                
                props.updateProfile({profile:response.data.profile_img});   //Trigger profile update
                props.closeModal();     //Close the newImg modal
            })
            .catch(error => {
                console.log(error)
            })
        }
    }

    // Used to close the modal when the user clicks outside of the modal
    const closeModal = (e) => {
        if (e.target.className === 'modal') {
            props.toggleModal();
        }
    }


    return (
        <div className="modal" onClick={closeModal}>
            <div className='modal-main'>
                <div className="modal-header">
                    <div className='post-header'>
                        {props.cover? <h1>Add New Cover Photo</h1> : <h1>Add New Profile Photo</h1>}
                    </div>
                    <button className='close-modal' id='x-modal' onClick={props.toggleModal}>X</button>
                </div>
                <hr />
                <form id='new-post-form' className='new-img-form' onSubmit={handleSubmit} encType="multipart/form-data">
                    <input type='file' id='image' name='image' accept='image/*' onChange={handleChange}/>
                    {error===''? null : <span className='error'>{error}</span>}
                    <button type='submit'>Submit</button>
                </form>
            </div>
        </div>
    );
}

export default NewImg;
