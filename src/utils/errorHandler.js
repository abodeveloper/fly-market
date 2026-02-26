import { toast } from 'sonner';

/**
 * Global API elerror handler to standardize error toasts
 * according to the backend response format:
 * { message: "Bad Credentials", error: "Unauthorized", statusCode: 401 }
 */
export const handleApiError = (error, defaultMessage = "Xatolik yuz berdi") => {
  const errData = error?.response?.data;
  
  if (errData && errData.error) {
    const statusCode = errData.statusCode || error?.response?.status || '';
    const message = errData.message || defaultMessage;
    const description = statusCode ? `${message} (Status: ${statusCode})` : message;

    toast.error(errData.error, {
      description: description
    });
  } else {
    // Fallback for network errors or unformatted errors
    toast.error(errData?.message || error?.message || defaultMessage);
  }
};
