import { useState } from "react";
import { X, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ContactFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  reason: string;
  message: string;
  discoverSource: string;
}

type SubmitStatus = "idle" | "loading" | "success" | "error";

const ContactFormModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    reason: "",
    message: "",
    discoverSource: "",
  });

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("loading");
    setErrorMessage("");

    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone_number: formData.phoneNumber,
      reason: formData.reason,
      message: formData.message,
      referral: formData.discoverSource,
    };

    try {
      // Step 1: initialise session & get XSRF-TOKEN cookie
      await fetch("/sanctum/csrf-cookie", {
        credentials: "include",
      });

      // Step 2: read the token Laravel stored in the cookie
      const xsrfToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("XSRF-TOKEN="))
        ?.split("=")[1];

      if (!xsrfToken) {
        throw new Error(
          "Could not retrieve CSRF token. Please refresh and try again.",
        );
      }

      // Step 3: POST with the decoded token as X-XSRF-TOKEN header
      const response = await fetch("/submit-contact", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(xsrfToken),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errMsg = `Server error (${response.status})`;
        try {
          const errData = await response.json();
          if (errData?.message || errData?.error) {
            errMsg = errData.message ?? errData.error;
          }
        } catch {
          // ignore JSON parse errors for error body
        }
        throw new Error(errMsg);
      }

      setSubmitStatus("success");
      setFormData({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        reason: "",
        message: "",
        discoverSource: "",
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setErrorMessage(message);
      setSubmitStatus("error");
    }
  };

  const handleClose = () => {
    setSubmitStatus("idle");
    setErrorMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[101]"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-sm z-[102] overflow-y-auto max-h-[95vh] sm:max-h-[90vh] md:max-h-[95vh]">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex justify-between items-center mb-2 sm:mb-3 md:mb-4">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-foreground">
              Contact Us
            </h2>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground transition-colors p-0.5 sm:p-1"
              aria-label="Close"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>
          </div>

          <p className="text-muted-foreground text-[0.85rem] sm:text-xs md:text-xs mb-3 sm:mb-4 md:mb-6">
            We are transitioning our website, kindly share your details & we
            shall get in touch. 100% confidential & secure.
          </p>

          {/* Success state */}
          {submitStatus === "success" && (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
              <p className="text-base font-semibold text-foreground">
                Message Sent!
              </p>
              <p className="text-sm text-muted-foreground">
                Thank you for contacting us. We'll get in touch with you soon.
              </p>
              <button
                onClick={handleClose}
                className="mt-2 bg-primary text-primary-foreground py-1.5 px-5 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium"
              >
                Close
              </button>
            </div>
          )}

          {/* Form */}
          {submitStatus !== "success" && (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3 md:mb-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-[0.85rem] font-medium text-foreground mb-0.5 sm:mb-1"
                  >
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    disabled={submitStatus === "loading"}
                    className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 text-[0.85rem] border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60"
                    placeholder="Amit"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-[0.85rem] font-medium text-foreground mb-0.5 sm:mb-1"
                  >
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    disabled={submitStatus === "loading"}
                    className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 text-[0.85rem] border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60"
                    placeholder="Rathi"
                  />
                </div>
              </div>

              <div className="mb-2 sm:mb-3 md:mb-4">
                <label
                  htmlFor="phoneNumber"
                  className="block text-[0.85rem] font-medium text-foreground mb-0.5 sm:mb-1"
                >
                  Mobile Number*
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  disabled={submitStatus === "loading"}
                  className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 text-[0.85rem] border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60"
                  placeholder="9136899581"
                />
              </div>

              <div className="mb-2 sm:mb-3 md:mb-4">
                <label
                  htmlFor="reason"
                  className="block text-[0.85rem] font-medium text-foreground mb-0.5 sm:mb-1"
                >
                  Query For*
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  disabled={submitStatus === "loading"}
                  className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 text-[0.85rem] border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60"
                >
                  <option value="">Select a reason</option>
                  <option value="personal_support">Personal Support</option>
                  <option value="corporate_query">Corporate Query</option>
                  <option value="solv_session_request">
                    SOLV Session Request
                  </option>
                  <option value="counselling_support">
                    Counselling Support
                  </option>
                  <option value="self_help_support">Self Help Support</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-2 sm:mb-3 md:mb-4">
                <label
                  htmlFor="message"
                  className="block text-[0.85rem] font-medium text-foreground mb-0.5 sm:mb-1"
                >
                  Enter Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={1}
                  disabled={submitStatus === "loading"}
                  className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 text-[0.85rem] border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60"
                  placeholder="Your message here..."
                ></textarea>
              </div>

              <div className="mb-3 sm:mb-4 md:mb-6">
                <label
                  htmlFor="discoverSource"
                  className="block text-[0.85rem] font-medium text-foreground mb-0.5 sm:mb-1"
                >
                  Select Preferred Reachout Slot*
                </label>
                <select
                  id="discoverSource"
                  name="discoverSource"
                  value={formData.discoverSource}
                  onChange={handleChange}
                  required
                  disabled={submitStatus === "loading"}
                  className="w-full px-1.5 py-1 sm:px-2 sm:py-1.5 md:px-3 md:py-2 text-[0.85rem] border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-60"
                >
                  <option value="">Select an option</option>
                  <option value="Morning (9 am - 12 pm)">
                    Morning (9 am - 12 pm)
                  </option>
                  <option value="Afternoon (12 pm - 4 pm)">
                    Afternoon (12 pm - 4 pm)
                  </option>
                  <option value="Evening (4 pm - 8 pm)">
                    Evening (4 pm - 8 pm)
                  </option>
                </select>
              </div>

              {/* Error banner */}
              {submitStatus === "error" && (
                <div className="flex items-start gap-2 mb-3 p-2.5 rounded-md bg-red-50 border border-red-200 text-red-700">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <p className="text-[0.8rem] leading-snug">{errorMessage}</p>
                </div>
              )}

              <div className="flex gap-1.5 sm:gap-2 md:gap-3">
                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-1.5 px-2 sm:py-2 sm:px-3 md:py-2 md:px-4 rounded-md hover:bg-primary/90 transition-colors text-[0.85rem] font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {submitStatus === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactFormModal;
