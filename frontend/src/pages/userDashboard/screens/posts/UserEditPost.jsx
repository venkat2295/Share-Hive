import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import { getSinglePost, updatePost } from "../../../../services/index/posts";
import { useParams, useNavigate } from "react-router-dom";
import { HiOutlineCamera } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import Editor from "../../../../components/editor/Editor";
import MultiSelectTagDropdown from "../../components/select-dropdown/MultiSelectTagDropdown";
import { getAllCategories } from "../../../../services/index/postCategories";
import { filterCategories } from "../../../../utils/multiSelectTagUtils";

const promiseOptions = async (inputValue) => {
  const { data: categoriesData } = await getAllCategories();
  return filterCategories(inputValue, categoriesData);
};

const UserEditPost = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const userState = useSelector((state) => state.user);
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [body, setBody] = useState("");
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [postSlug, setPostSlug] = useState(slug);
  const [caption, setCaption] = useState("");

  // Fetch the existing post data
  const { data, isLoading, isError } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => getSinglePost({ slug }),
    onSuccess: (data) => {
      setInitialPhoto(data?.photo);
      setCategories(data.categories.map((item) => item._id));
      setTitle(data.title);
      setTags(data.tags);
      setBody(data.body);
      setCaption(data.caption);
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: mutateUpdatePost, isLoading: isLoadingUpdatePost } = useMutation({
    mutationFn: ({ updatedData, slug, token }) => {
      return updatePost({ updatedData, slug, token });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["blog", slug]);
      toast.success("Post updated successfully");
      navigate(`/dashboard/posts/manage/edit/${data.slug}`, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleUpdatePost = async () => {
    let updatedData = new FormData();

    if (!initialPhoto && photo) {
      updatedData.append("postPicture", photo);
    } else if (initialPhoto && !photo) {
      updatedData.append("postPicture", initialPhoto);
    }

    updatedData.append(
      "document",
      JSON.stringify({ body, categories, title, tags, slug: postSlug, caption })
    );

    mutateUpdatePost({
      updatedData,
      slug,
      token: userState.userInfo.token,
    });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading post data.</div>;

  return (
    <div className="container mx-auto max-w-5xl flex flex-col px-5 py-5 lg:flex-row lg:gap-x-5 lg:items-start">
      <article className="flex-1">
        <label htmlFor="postPicture" className="w-full cursor-pointer">
          {photo ? (
            <img
              src={URL.createObjectURL(photo)}
              alt="post cover"
              className="rounded-xl w-full"
            />
          ) : (
            <div className="w-full min-h-[200px] bg-blue-50/50 flex justify-center items-center">
              <HiOutlineCamera className="w-7 h-auto text-primary" />
            </div>
          )}
        </label>
        <input
          type="file"
          className="sr-only"
          id="postPicture"
          onChange={handleFileChange}
        />
        <div className="d-form-control w-full mt-4">
          <label className="d-label" htmlFor="title">
            <span className="d-label-text">Title</span>
          </label>
          <input
            id="title"
            value={title}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
        </div>
        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="caption">
            <span className="d-label-text">Caption</span>
          </label>
          <input
            id="caption"
            value={caption}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption"
          />
        </div>
        <div className="d-form-control w-full">
          <label className="d-label" htmlFor="slug">
            <span className="d-label-text">Slug</span>
          </label>
          <input
            id="slug"
            value={postSlug}
            className="d-input d-input-bordered border-slate-300 !outline-slate-300 text-xl font-medium font-roboto text-dark-hard"
            onChange={(e) =>
              setPostSlug(e.target.value.replace(/\s+/g, "-").toLowerCase())
            }
            placeholder="Post slug"
          />
        </div>
        <div className="mb-5 mt-2">
          <label className="d-label">
            <span className="d-label-text">Categories</span>
          </label>
          <MultiSelectTagDropdown
            loadOptions={promiseOptions}
            onChange={(newValue) =>
              setCategories(newValue.map((item) => item.value))
            }
          />
        </div>
        <div className="mb-5 mt-2">
          <label className="d-label">
            <span className="d-label-text">Tags</span>
          </label>
          <CreatableSelect
            isMulti
            onChange={(newValue) =>
              setTags(newValue.map((item) => item.value))
            }
            className="relative z-20"
          />
        </div>
        <div className="w-full">
          <Editor
            content={body}
            editable={true}
            onDataChange={(data) => {
              setBody(data);
            }}
          />
        </div>
        <button
          disabled={isLoadingUpdatePost}
          type="button"
          onClick={handleUpdatePost}
          className="w-full bg-green-500 text-white font-semibold rounded-lg px-4 py-2 mt-4 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Update Post
        </button>
      </article>
    </div>
  );
};

export default UserEditPost;