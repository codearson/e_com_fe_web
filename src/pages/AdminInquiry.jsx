import React, { useState, useEffect } from "react";
import { getAllInquiries, updateInquiry } from "../API/inquiryApi";
import AdminLayout from "../components/AdminLayout";
import Modal from "../components/Modal";

const AdminInquiry = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [adminReply, setAdminReply] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const result = await getAllInquiries();
        if (result && result.responseDto && Array.isArray(result.responseDto)) {
          setInquiries(result.responseDto);
        } else if (result && result.responseDto && Array.isArray(result.responseDto.payload)) {
            setInquiries(result.responseDto.payload);
        } else {
          setInquiries([]);
          setError(result.error || "Failed to fetch inquiries. Unexpected data format.");
        }
      } catch (err) {
        setError("An unexpected error occurred while fetching inquiries.");
        console.error(err);
      }
    };
    fetchInquiries();
  }, []);

  const handleView = (inquiry) => {
    setSelectedInquiry(inquiry);
    setAdminReply(inquiry.adminReply || "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInquiry(null);
    setAdminReply("");
    setError("");
  };

  const handleUpdateInquiry = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const inquiryData = {
      adminReply,
      status: "replied",
    };

    try {
      const result = await updateInquiry(selectedInquiry.id, inquiryData);
      if (result.responseDto) {
        const updatedInquiries = inquiries.map((inq) =>
          inq.id === selectedInquiry.id ? result.responseDto : inq
        );
        setInquiries(updatedInquiries);
        closeModal();
      } else {
        setError(result.error || "Failed to submit reply.");
      }
    } catch (err) {
      setError("An unexpected error occurred during reply submission.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 bg-gray-100 min-h-full">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Inquiries</h1>
        
        {error && !isModalOpen && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="relative px-4 py-3"><span className="sr-only">View</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inquiries.length > 0 ? inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{inquiry.userName}</div>
                      <div className="text-sm text-gray-500">{inquiry.userEmail}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800 max-w-xs truncate">{inquiry.subject}</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${inquiry.status.toLowerCase() === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleView(inquiry)} className="text-indigo-600 hover:text-indigo-900 font-semibold">View</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="text-center py-8 text-gray-500">No inquiries found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={isModalOpen} onClose={closeModal}>
        {selectedInquiry && (
          <div className="p-6 bg-white rounded-lg shadow-xl max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Inquiry Details</h2>
            <div className="space-y-4 text-sm">
              <p><strong>From:</strong> {selectedInquiry.userName} ({selectedInquiry.userEmail})</p>
              <p><strong>Reference:</strong> {selectedInquiry.referenceNumber}</p>
              <p><strong>Subject:</strong> {selectedInquiry.subject}</p>
              
              <div className="border-t pt-4 mt-4">
                <strong className="block mb-2 text-sm font-medium">Message:</strong>
                <p className="bg-gray-100 p-3 rounded-md text-gray-800 whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>

              {selectedInquiry.adminReply && (
                <div className="border-t pt-4 mt-4">
                  <strong className="block mb-2 text-sm font-medium">Your Reply:</strong>
                  <p className="bg-blue-100 p-3 rounded-md text-blue-900 whitespace-pre-wrap">{selectedInquiry.adminReply}</p>
                </div>
              )}

              <form onSubmit={handleUpdateInquiry} className="border-t pt-4 mt-4">
                <div className="mb-4">
                  <label htmlFor="adminReply" className="block text-sm font-medium text-gray-700 mb-2">{selectedInquiry.adminReply ? 'Update Reply' : 'Add a Reply'}</label>
                  <textarea id="adminReply" value={adminReply} onChange={(e) => setAdminReply(e.target.value)} rows="4" required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
                </div>
                
                {error && <div className="text-red-600 bg-red-100 p-3 rounded-md mb-4 text-sm">{error}</div>}

                <div className="flex justify-end gap-4">
                   <button type="button" onClick={closeModal} className="py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">Cancel</button>
                   <button type="submit" disabled={isSubmitting} className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400">
                      {isSubmitting ? "Replying..." : "Submit Reply"}
                   </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminInquiry;