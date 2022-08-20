import React, { useState, useRef, useEffect } from "react";
import { Button, Form, Input, message, Select } from "antd";
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { useDispatch, useSelector } from "react-redux";
import { uploadImage, uploadPost } from "../../actions/UploadAction";
import axios from "axios";

const { Option } = Select;
const { TextArea } = Input;

const PostShare = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.authReducer.authData);
  const loading = useSelector((state) => state.postReducer.uploading);
  const [districts, setDistricts] = useState([]);

  const [selectedDis, setSelectedDis] = useState("");
  const [image, setImage] = useState(null);

  const [postDetails, setPostDetails] = useState({ details: "", district: "", title: "" });

  const serverPublic = process.env.REACT_APP_PUBLIC_FOLDER;

  // handle Image Change
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage(img);
    }
  };

  useEffect(() => {
    axios.get("https://bdapis.herokuapp.com/api/v1.1/districts").then((res) => setDistricts(res?.data?.data));
  }, []);

  const imageRef = useRef();

  // handle post upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!image || !postDetails.details || !postDetails.title || !postDetails.district) {
      console.log(image);
      message.error("Please fill all filed ");

      return;
    }
    //post data
    const newPost = {
      userId: user._id,
      desc: postDetails.details,
      title: postDetails.title,
      district: postDetails.district,
    };

    // if there is an image with post
    if (image) {
      const data = new FormData();
      const fileName = Date.now() + image.name;
      data.append("name", fileName);
      data.append("file", image);
      newPost.image = fileName;
      console.log(newPost);
      try {
        dispatch(uploadImage(data));
      } catch (err) {
        console.log(err);
      }
    }
    dispatch(uploadPost(newPost));
    resetShare();
    message.success("successfully share your post");
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  // Reset Post Share
  const resetShare = () => {
    setImage(null);

    setPostDetails((pre) => {
      return {
        title: "",
        district: "",
        details: "",
      };
    });
  };

  const handelDistictChange = (value) => {
    console.log(value);
    setPostDetails((pre) => {
      return { ...pre, district: value };
    });
  };

  console.log(postDetails);
  return (
    <div className="PostShare">
      <img src={user.profilePicture ? serverPublic + user.profilePicture : serverPublic + "defaultProfile.png"} alt="Profile" />
      <div>
        <Input
          onChange={(e) =>
            setPostDetails((pre) => {
              return { ...pre, title: e.target.value };
            })
          }
          value={postDetails.title}
          required
          type="text"
          placeholder="Title gose here"
        />
        <Select
          style={{ minWidth: "400px" }}
          showSearch
          placeholder="Select a district"
          label="Selete district"
          optionFilterProp="children"
          onChange={handelDistictChange}
          defaultValue={postDetails.district}
          onSearch={onSearch}
          filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
        >
          {districts.map((x) => (
            <Option key={x._id} value={x._id}>
              {x.district}
            </Option>
          ))}
        </Select>
        <TextArea
          value={postDetails.details}
          onChange={(e) =>
            setPostDetails((pre) => {
              return { ...pre, details: e.target.value };
            })
          }
          type="text"
          placeholder="What's happening?"
          required
          rows={4}
        />

        <div className="postOptions">
          <div className="option" style={{ color: "var(--photo)" }} onClick={() => imageRef.current.click()}>
            <UilScenery />
            Photo
          </div>

          <button className="button ps-button" onClick={handleUpload} disabled={loading}>
            {loading ? "uploading" : "Share"}
          </button>

          <div style={{ display: "none" }}>
            <input type="file" ref={imageRef} onChange={onImageChange} />
          </div>
        </div>

        {image && (
          <div className="previewImage">
            <UilTimes onClick={() => setImage(null)} />
            <img src={URL.createObjectURL(image)} alt="preview" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostShare;
