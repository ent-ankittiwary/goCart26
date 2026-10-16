// "use client";

// import { assets } from "@/assets/assets";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import toast from "react-hot-toast";
// import Loading from "@/components/Loading";
// import {useRouter} from "next/navigation";
// import {useUser,useAuth} from "@clerk/nextjs";
// import axios from "axios";

// export default function CreateStore() {
//   const [alreadySubmitted, setAlreadySubmitted] = useState(false);
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [message, setMessage] = useState("");
//   const {user} = useUser();
//   const router = useRouter();
//   const {getToken} = useAuth();

//   const [storeInfo, setStoreInfo] = useState({
//     name: "",
//     username: "",
//     description: "",
//     email: "",
//     contact: "",
//     address: "",
//     image: "",
//   });

//   const onChangeHandler = (e) => {
//     setStoreInfo({
//       ...storeInfo,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const fetchSellerStatus = async () => {
//     // Logic to check if the store is already submitted
//     setLoading(false);
//   };

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     // Logic to submit the store details
//     if (!user) {
//       toast.error("Please Login to continue");
//       return;
//     }

//     try {
//       const token = await getToken();

//       const formData = new FormData();
//       formData.append("name", storeInfo.name);
//       formData.append("description", storeInfo.description);
//       formData.append("username", storeInfo.username);
//       formData.append("email", storeInfo.email);
//       formData.append("contact", storeInfo.contact);
//       formData.append("address", storeInfo.address);
  

//       if (storeInfo.image instanceof File) {
//           formData.append("image", storeInfo.image)
//       }

//       const { data } = await axios.post("/api/store/create", formData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       toast.success(data.message || "Store submitted successfully");

//       // Refresh seller status here if your API supports it
//       // await fetchSellerStatus();
//     } catch (error) {
//       toast.error(
//         error?.response?.data?.error ||
//           error?.response?.data?.message ||
//           error.message ||
//           "Something went wrong",
//       );
//     }
//   };
//   useEffect(() => {
//     fetchSellerStatus();
//   }, []);

//   if (!user) {
//     return (
//       <div
//         className="min-h-[80vh] mx-6 flex items-center justify-center
// text-slate-400"
//       >
//         <h1 className="text-2x1 sm: text-4xl font-semibold">
//           Please <span className="text-slate-500">Login</span> to continue
//         </h1>
//       </div>
//     );
//   }

//   return !loading ? (
//     <div>
//       {!alreadySubmitted ? (
//         <div className="mx-6 min-h-[70vh] my-16">
//           <form
//             onSubmit={(e) =>
//               toast.promise(onSubmitHandler(e), {
//                 loading: "Submitting data...",
//               })
//             }
//             className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500"
//           >
//             {/* Title */}
//             <div>
//               <h1 className="text-3xl">
//                 Add Your{" "}
//                 <span className="text-slate-800 font-medium">Store</span>
//               </h1>
//               <p className="max-w-lg">
//                 To become a seller on GoCart, submit your store details for
//                 review. Your store will be activated after admin verification.
//               </p>
//             </div>

//             <label className="mt-10 cursor-pointer">
//               Store Logo
//               <Image
//                 src={
//                   storeInfo.image
//                     ? URL.createObjectURL(storeInfo.image)
//                     : assets.upload_area
//                 }
//                 className="rounded-lg mt-2 h-16 w-auto"
//                 alt=""
//                 width={150}
//                 height={100}
//               />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) =>
//                   setStoreInfo({
//                     ...storeInfo,
//                     image: e.target.files?.[0] || "",
//                   })
//                 }
//                 hidden
//               />
//             </label>

//             <p>Username</p>
//             <input
//               name="username"
//               onChange={onChangeHandler}
//               value={storeInfo.username}
//               type="text"
//               placeholder="Enter your store username"
//               className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
//             />

//             <p>Name</p>
//             <input
//               name="name"
//               onChange={onChangeHandler}
//               value={storeInfo.name}
//               type="text"
//               placeholder="Enter your store name"
//               className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
//             />

//             <p>Description</p>
//             <textarea
//               name="description"
//               onChange={onChangeHandler}
//               value={storeInfo.description}
//               rows={5}
//               placeholder="Enter your store description"
//               className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none"
//             />

//             <p>Email</p>
//             <input
//               name="email"
//               onChange={onChangeHandler}
//               value={storeInfo.email}
//               type="email"
//               placeholder="Enter your store email"
//               className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
//             />

//             <p>Contact Number</p>
//             <input
//               name="contact"
//               onChange={onChangeHandler}
//               value={storeInfo.contact}
//               type="text"
//               placeholder="Enter your store contact number"
//               className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
//             />

//             <p>Address</p>
//             <textarea
//               name="address"
//               onChange={onChangeHandler}
//               value={storeInfo.address}
//               rows={5}
//               placeholder="Enter your store address"
//               className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none"
//             />

//             <button
//               type="submit"
//               className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition"
//             >
//               Submit
//             </button>
//           </form>
//         </div>
//       ) : (
//         <div className="min-h-[80vh] flex flex-col items-center justify-center">
//           <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">
//             {message}
//           </p>

//           {status === "approved" && (
//             <p className="mt-5 text-slate-400">
//               Redirecting to dashboard in{" "}
//               <span className="font-semibold">5 seconds</span>
//             </p>
//           )}
//         </div>
//       )}
//     </div>
//   ) : (
//     <Loading />
//   );
// }


"use client";

import { assets } from "@/assets/assets";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { useUser, useAuth } from "@clerk/nextjs";
import axios from "axios";

export default function CreateStore() {
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  //Added from tutorial
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const { getToken } = useAuth();

  const [storeInfo, setStoreInfo] = useState({
    name: "",
    username: "",
    description: "",
    email: "",
    contact: "",
    address: "",
    image: "",
  });

  // Create and clean up the selected image preview URL.
  useEffect(() => {
    if (!(storeInfo.image instanceof File)) {
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(storeInfo.image);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [storeInfo.image]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setStoreInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Check whether the current user has already submitted a store.
  const fetchSellerStatus = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/store/create", {
        headers: token
          ? { Authorization: `Bearer ${token}` }
          : {},
      });

      const currentStatus = data.status || "not registered";

      setStatus(currentStatus);

      if (currentStatus !== "not registered") {
        setAlreadySubmitted(true);

        if (currentStatus === "approved") {
          setMessage(
            "Your store has been approved! You can now access your seller features."
          );
        } else if (currentStatus === "rejected") {
          setMessage(
            "Your store application was rejected. Please contact support for more information."
          );
        } else {
          setMessage(
            "Your store application has been submitted and is waiting for admin approval."
          );
        }
      } else {
        setAlreadySubmitted(false);
      }
    } catch (error) {
      console.error("Fetch seller status error:", error);
      toast.error(
        error?.response?.data?.error ||
          "Unable to fetch your store status. Please refresh the page."
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to continue");
      return;
    }

    if (
      !storeInfo.name.trim() ||
      !storeInfo.username.trim() ||
      !storeInfo.description.trim() ||
      !storeInfo.email.trim() ||
      !storeInfo.contact.trim() ||
      !storeInfo.address.trim()
    ) {
      toast.error("Please fill in all the required fields");
      return;
    }

    if (!(storeInfo.image instanceof File)) {
      toast.error("Please select a store logo");
      return;
    }

    if (!storeInfo.image.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (storeInfo.image.size > 5 * 1024 * 1024) {
      toast.error("Image size must not exceed 5 MB");
      return;
    }

    setSubmitting(true);

    try {
      const token = await getToken();

      if (!token) {
        throw new Error("Unable to authenticate. Please log in again.");
      }

      const formData = new FormData();

      formData.append("name", storeInfo.name.trim());
      formData.append("username", storeInfo.username.trim());
      formData.append("description", storeInfo.description.trim());
      formData.append("email", storeInfo.email.trim());
      formData.append("contact", storeInfo.contact.trim());
      formData.append("address", storeInfo.address.trim());
      formData.append("image", storeInfo.image);

      const { data } = await axios.post("/api/store/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(data.message || "Store submitted successfully");

      // Refresh the application status after a successful submission.
      await fetchSellerStatus();
    } catch (error) {
      console.error("Create store error:", error);

      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchSellerStatus();
    } else if (isLoaded && !user) {
      setLoading(false);
    }
    // Run when Clerk finishes loading or the signed-in user changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, user?.id]);

  if (!isLoaded || loading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
        <h1 className="text-2xl sm:text-4xl font-semibold">
          Please <span className="text-slate-500">login</span> to continue
        </h1>
      </div>
    );
  }

  return (
    <div>
      {!alreadySubmitted ? (
        <div className="mx-6 min-h-[70vh] my-16">
          <form
            onSubmit={onSubmitHandler}
            className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500"
          >
            {/* Title */}
            <div>
              <h1 className="text-3xl">
                Add Your{" "}
                <span className="text-slate-800 font-medium">Store</span>
              </h1>

              <p className="max-w-lg">
                To become a seller on GoCart, submit your store details for
                review. Your store will be activated after admin verification.
              </p>
            </div>

            {/* Store logo */}
            <label className="mt-10 cursor-pointer">
              Store Logo

              <Image
                src={previewUrl || assets.upload_area}
                className="rounded-lg mt-2 h-16 w-auto object-contain"
                alt="Store logo preview"
                width={150}
                height={100}
              />

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setStoreInfo((prev) => ({
                    ...prev,
                    image: e.target.files?.[0] || "",
                  }))
                }
                hidden
              />
            </label>

            <p>Username</p>
            <input
              name="username"
              onChange={onChangeHandler}
              value={storeInfo.username}
              type="text"
              required
              placeholder="Enter your store username"
              className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
            />

            <p>Name</p>
            <input
              name="name"
              onChange={onChangeHandler}
              value={storeInfo.name}
              type="text"
              required
              placeholder="Enter your store name"
              className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
            />

            <p>Description</p>
            <textarea
              name="description"
              onChange={onChangeHandler}
              value={storeInfo.description}
              rows={5}
              required
              placeholder="Enter your store description"
              className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none"
            />

            <p>Email</p>
            <input
              name="email"
              onChange={onChangeHandler}
              value={storeInfo.email}
              type="email"
              required
              placeholder="Enter your store email"
              className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
            />

            <p>Contact Number</p>
            <input
              name="contact"
              onChange={onChangeHandler}
              value={storeInfo.contact}
              type="tel"
              required
              placeholder="Enter your store contact number"
              className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded"
            />

            <p>Address</p>
            <textarea
              name="address"
              onChange={onChangeHandler}
              value={storeInfo.address}
              rows={5}
              required
              placeholder="Enter your store address"
              className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none"
            />

            <button
              type="submit"
              disabled={submitting}
              className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      ) : (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
          <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">
            {message}
          </p>

          {status === "approved" && (
            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-6 bg-slate-800 text-white px-8 py-2 rounded hover:bg-slate-900 transition"
            >
              Continue
            </button>
          )}
        </div>
      )}
    </div>
  );
}