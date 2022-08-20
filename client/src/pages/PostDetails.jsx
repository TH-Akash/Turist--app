/* eslint-disable jsx-a11y/img-redundant-alt */
import { Avatar, Button, Card, message, Rate, Tag } from "antd";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

const { Meta } = Card;

const PostDetails = () => {
  const location = useLocation();
  let { id } = useParams();

  const [review, setReview] = useState(0);
  const [comments, setComments] = useState("");
  const [isReview, setAlreadyReviewed] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [relatedHotel, setRelatedHotel] = useState([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [postDetails, setPostDetails] = useState({});
  const [reFetch, setFetch] = useState(false);

  // const { data, loading, error, reFetch } = useFetch(`/tourist_place/details/${id}`);

  useEffect(() => {
    axios.get(`http://localhost:5000/posts/${id}`).then((res) => setPostDetails(res.data));
  }, [reFetch]);
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token, "token");
    setUserToken(token);
  }, []);

  console.log(postDetails);
  const onReviewChange = (v) => {
    setReview(v);
  };
  const data = 1;
  // useEffect(() => {
  //   if (data && data?.reviews?.length > 0 && user) {
  //     const res = data?.reviews.find((x) => x.emal === user.email);
  //     if (res) {
  //       setAlreadyReviewed(true);
  //     } else {
  //       setAlreadyReviewed(false);
  //     }
  //   }
  // }, [data, user]);

  const getRelatedHotels = async (data) => {
    // const res = await api_request.get(`/hotels?city=${data?.district}`);
    // console.log(res, "res ");
    // setRelatedHotel(res);
  };

  useEffect(() => {
    // getRelatedHotels(data);
  }, [data]);
  const headers = {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem("profile")).token}`,
  };

  const onReviewSubmit = async () => {
    if (!review || !comments) {
      message.error("rating and comments are required");
    } else if (isReview) {
      message.error("you already reviewed on this post you can't review again ");
    } else {
      setReviewLoading(true);
      try {
        const res = await axios.put(
          `http://localhost:5000/posts/review/${id}`,
          {
            rating: review,
            comment: comments,
          },
          {
            headers: headers,
          },
        );

        // console.log(res);
        setReviewLoading(false);
        message.success("successFully Added your review ");

        setFetch((pre) => !pre);
        // reFetch();
      } catch (error) {
        setReviewLoading(false);

        message.error(error?.response?.data?.message);
      }
    }
  };

  console.log(relatedHotel, "kk");

  return (
    <div>
      <div className="container mt-5 p-4">
        <div className="row">
          <div className="col-md-6">
            <img
              style={{ width: "100%" }}
              src={postDetails?.image ? process.env.REACT_APP_PUBLIC_FOLDER + postDetails?.image : ""}
              alt="image"
            />
            <Card style={{ width: 300 }}>
              <Meta
                avatar={
                  // eslint-disable-next-line jsx-a11y/img-redundant-alt
                  <img
                    style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                    src={
                      postDetails?.userId?.profilePicture ? process.env.REACT_APP_PUBLIC_FOLDER + postDetails?.userId?.profilePicture : ""
                    }
                    alt="image"
                  />
                }
                title={
                  <p>
                    Posted By: <Tag color="green"> {postDetails?.userId?.username || ""} </Tag>{" "}
                  </p>
                }
              />
            </Card>
          </div>
          <div className="col-md-6 p-4">
            <h1 className="mb-4">{postDetails?.title} </h1>

            <p>{postDetails?.desc} </p>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mt-5">
            <Card title="Review and rating" bordered={true}>
              Average review <Rate allowHalf disabled value={postDetails?.rating} /> ({postDetails?.rating} / {postDetails?.numReviews})
            </Card>

            <div className="row mt-3">
              {postDetails?.reviews?.length > 0 ? (
                postDetails?.reviews.map((x) => {
                  return (
                    <div className="col-12 my-2">
                      <Card style={{ width: 300 }}>
                        <Meta
                          avatar={
                            <Avatar
                              src={
                                x?.user?.profilePicture
                                  ? process.env.REACT_APP_PUBLIC_FOLDER + x?.user?.profilePicture
                                  : "https://joeschmoe.io/api/v1/random"
                              }
                            />
                          }
                          title={
                            <>
                              <p>
                                {" "}
                                <Tag color="green"> {x?.user?.username} </Tag>{" "}
                              </p>
                              <br />

                              <Rate allowHalf disabled defaultValue={x?.rating} />
                            </>
                          }
                          description={x.comment}
                        />
                      </Card>
                    </div>
                  );
                })
              ) : (
                <h4> No Review </h4>
              )}
            </div>

            <div className="row mt-3">
              <div className="col-md-12">
                <Card style={{ width: 300 }}>
                  <Meta title="Give your review here" />

                  <Rate disabled={isReview} onChange={setReview} allowHalf defaultValue={0} />
                  <div className="mb-3">
                    <label for="exampleFormControlTextarea1" className="form-label">
                      Comments
                    </label>
                    <textarea
                      onChange={(e) => setComments(e.target.value)}
                      className="form-control"
                      id="exampleFormControlTextarea1"
                      disabled={isReview}
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <Button disabled={reviewLoading || isReview} type="button" onClick={onReviewSubmit} loading={reviewLoading}>
                      {" "}
                      Submit{" "}
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5 ">
        <div className="row">
          <h1 className="my-4 mx-auto">Related Posts </h1>

          {relatedHotel &&
            relatedHotel.length > 0 &&
            relatedHotel.map((x) => {
              return (
                <div key={x._id} className="col-md-4">
                  <Card
                    extra={<Link to={`/hotels/${x._id}`}>More</Link>}
                    hoverable
                    style={{ width: 240 }}
                    cover={<img alt="example" src={x.photos?.[0]} />}
                  >
                    <Meta title={x.name} description={<Tag color="magenta"> Location : {`${x.city}`}</Tag>} />
                  </Card>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
