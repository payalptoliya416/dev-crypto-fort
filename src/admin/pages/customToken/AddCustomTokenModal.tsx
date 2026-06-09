import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FiUpload, FiX } from "react-icons/fi";
import { useState } from "react";
import { importCustomToken } from "../../adminapi/adminTransactions";
import toast from "react-hot-toast";
interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

interface FormValues {
  contract_address: string;
  icon: File | null;
}

function AddCustomTokenModal({ onClose, onSuccess }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const initialValues: FormValues = {
    contract_address: "",
    icon: null,
  };

  const validationSchema = Yup.object({
    contract_address: Yup.string().required(
      "Contract address is required"
    ),
     icon: Yup.mixed()
    .required("Token icon is required"),
  });

  const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);

    reader.onerror = reject;
  });
};

const handleSubmit = async (values: FormValues) => {
  try {
    setLoading(true);

    if (!values.icon) {
      toast.error("Please upload token icon");
      return;
    }

    const base64Image = await fileToBase64(values.icon);

    const payload = {
      contract_address: values.contract_address,
      is_eth: true,
      token_image: base64Image,
    };

    const importData = await importCustomToken(payload);

    toast.success(importData.message);

    onSuccess();
  } catch (error: any) {
    toast.error(error.message || "Failed to import token");
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
     <div  className="w-full max-w-2xl bg-[#0f1a2f] border border-[#3C3D47]
    rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto scrollbar-thin" >
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer"
        >
          <FiX size={22} />
        </button>

        <h2 className="text-2xl font-semibold text-white mb-6">
          Add Custom Token
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="space-y-6">
              <div>
                <label className="text-[#7A7D83] mb-2 block">
                  Smart Contract Address
                </label>

                <Field
                  name="contract_address"
                  placeholder="0x..."
                  className={`w-full rounded-xl bg-[#161F37]
                  px-5 py-3 text-white border
                  ${
                    errors.contract_address &&
                    touched.contract_address
                      ? "border-[#ef4343]"
                      : "border-[#3C3D47]"
                  }`}
                />

                <ErrorMessage
                  name="contract_address"
                  component="p"
                  className="text-[#ef4343] text-sm mt-1"
                />
              </div>

              <div>
                <label className="text-[#7A7D83] mb-2 block">
                  Token Icon
                </label>

                <label
                  className={`group relative w-full flex flex-col items-center justify-center
                  border border-dashed border-[#3C3D47]
                  rounded-xl p-4 cursor-pointer bg-[#161F37]
                 transition ${
                    errors.contract_address &&
                    touched.contract_address
                      ? "border-[#ef4343]"
                      : "border-[#3C3D47]"
                  }`}
                >
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                    const file = e.target.files?.[0];

                    setFieldValue("icon", file || null);

                    if (file) {
                        setPreview(URL.createObjectURL(file));
                    }
                    }}
                  />

                  {preview ? (
                    <div className="relative">
                      <img
                        src={preview}
                        alt="preview"
                        className="w-24 h-24 object-cover rounded-xl"
                      />

                      <div
                        className="absolute inset-0 bg-black/60 rounded-xl
                        opacity-0 group-hover:opacity-100
                        flex items-center justify-center
                        text-white text-sm transition"
                      >
                        Change Image
                      </div>
                    </div>
                  ) : (
                    <>
                      <FiUpload
                        size={24}
                        className="text-[#25C866] mb-2"
                      />

                      <span className="text-[#7A7D83]">
                        Upload Token Icon
                      </span>
                    </>
                  )}
                </label>

                {values.icon && (
                  <p className="text-[#25C866] text-sm mt-2">
                    {values.icon.name}
                  </p>
                )}
                    <ErrorMessage
                name="icon"
                component="p"
                className="text-[#ef4343] text-sm mt-1"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="px-6 py-3 rounded-xl bg-[#374151] text-white hover:bg-[#4B5563] disabled:opacity-50"
                >
                Cancel
                </button>

                <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-xl text-white font-semibold transition
                ${
                    loading
                    ? "bg-green-400 cursor-not-allowed opacity-70"
                    : "bg-[#25C866] hover:bg-green-500 cursor-pointer"
                }`}
                >
                {loading ? "Importing..." : "Import Token"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default AddCustomTokenModal;