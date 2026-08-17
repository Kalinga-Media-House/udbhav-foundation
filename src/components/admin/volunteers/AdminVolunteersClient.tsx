"use client";

import {
  Download,
  Loader2,
  Search,
  ShieldCheck,
} from "lucide-react";
import React, { useState } from "react";

import {
  reviewVolunteerApplication,
  assignVolunteerToProgram,
  assignVolunteerToEvent,
  logVolunteerActivityHours,
  uploadVolunteerCertificate,
  exportVolunteersCSV,
  updateVolunteerProfile,
} from "@/features/volunteers/actions";
import { ImageUploader } from "@/components/admin/ImageUploader";
import type {
  VolunteerRow,
  VolunteerApplicationRow,
} from "@/features/volunteers/repository";

interface Props {
  initialVolunteers: VolunteerRow[];
  initialApplications: VolunteerApplicationRow[];
}

export function AdminVolunteersClient({
  initialVolunteers,
  initialApplications,
}: Props) {
  const [activeTab, setActiveTab] = useState<"volunteers" | "applications">("volunteers");
  const [volunteers, setVolunteers] = useState<VolunteerRow[]>(initialVolunteers);
  const [applications, setApplications] = useState<VolunteerApplicationRow[]>(initialApplications);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Modal states
  const [selectedVolId, setSelectedVolId] = useState<string | null>(null);
  const [modalType, setModalType] = useState<"program" | "event" | "hours" | "certificate" | "profile" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form inputs for modals
  const [targetId, setTargetId] = useState(""); // program_id or event_id
  const [roleInput, setRoleInput] = useState("Volunteer");
  const [hoursInput, setHoursInput] = useState("4");
  const [notesInput, setNotesInput] = useState("");
  const [titleInput, setTitleInput] = useState("Certificate of Appreciation");
  const [mediaIdInput, setMediaIdInput] = useState("");

  // Profile Edit Inputs
  const [profileInput, setProfileInput] = useState<Partial<VolunteerApplicationRow>>({});

  const handleExportCSV = async () => {
    setIsExporting(true);
    setStatusMessage(null);
    try {
      const res = await exportVolunteersCSV({});
      const rows = res.data;
      if (!res.success || !rows || rows.length === 0) {
        setStatusMessage("No volunteer records to export.");
        return;
      }
      const headers = [
        "ID",
        "Full Name",
        "Email",
        "Mobile Number",
        "Occupation",
        "City/District",
        "State",
        "Status",
        "Public Visibility",
        "Created At",
      ];
      const csvContent = [
        headers.join(","),
        ...rows.map((r: any) =>
          [
            r.id,
            `"${(r.full_name || "").replace(/"/g, '""')}"`,
            r.email || "",
            r.mobile_number || "",
            `"${(r.occupation || "").replace(/"/g, '""')}"`,
            `"${(r.city_district || "").replace(/"/g, '""')}"`,
            `"${(r.state || "").replace(/"/g, '""')}"`,
            r.status || "",
            r.is_publicly_visible ? "Yes" : "No",
            r.created_at || "",
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `udbhav_volunteers_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setStatusMessage("CSV exported successfully (sensitive info excluded per security policy).");
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : "Failed to export CSV.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleReviewApp = async (applicationId: string, status: "accepted" | "rejected") => {
    try {
      await reviewVolunteerApplication({
        application_id: applicationId,
        status,
        notes: `Reviewed by admin on ${new Date().toLocaleDateString()}`,
      });
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status } : a))
      );
      setStatusMessage(`Application successfully ${status === "accepted" ? "approved" : "rejected"}.`);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : "Failed to review application.");
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVolId || !modalType) return;
    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      if (modalType === "program") {
        await assignVolunteerToProgram({
          volunteer_id: selectedVolId,
          program_id: targetId,
          role: roleInput,
        });
        setStatusMessage("Volunteer assigned to program successfully.");
      } else if (modalType === "event") {
        await assignVolunteerToEvent({
          volunteer_id: selectedVolId,
          event_id: targetId,
          role: roleInput,
        });
        setStatusMessage("Volunteer assigned to event successfully.");
      } else if (modalType === "hours") {
        await logVolunteerActivityHours({
          volunteer_id: selectedVolId,
          hours: Number(hoursInput) || 1,
          notes: notesInput || "Admin logged hours",
          program_id: targetId || undefined,
        });
        setStatusMessage("Activity hours logged successfully.");
        setVolunteers((prev) =>
          prev.map((v) =>
            v.id === selectedVolId
              ? { ...v, total_hours: (v.total_hours || 0) + (Number(hoursInput) || 0) }
              : v
          )
        );
      } else if (modalType === "certificate") {
        await uploadVolunteerCertificate({
          volunteer_id: selectedVolId,
          title: titleInput,
          media_file_id: mediaIdInput || "00000000-0000-0000-0000-000000000000",
        });
        setStatusMessage("Certificate issued and verified successfully.");
      } else if (modalType === "profile") {
        await updateVolunteerProfile({
          id: selectedVolId,
          ...profileInput,
        } as any);
        setApplications((prev) =>
          prev.map((a) => (a.id === selectedVolId ? { ...a, ...profileInput } : a))
        );
        setStatusMessage("Volunteer profile updated successfully.");
      }
      setModalType(null);
      setSelectedVolId(null);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredVolunteers = volunteers.filter(v => 
    v.volunteer_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.bio && v.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Volunteer Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage changemakers, review application history, assign roles, and issue certificates.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          disabled={isExporting}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition-colors disabled:opacity-50"
        >
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span>Export Volunteers CSV</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-sm font-medium flex items-center justify-between">
          <span>{statusMessage}</span>
          <button type="button" onClick={() => setStatusMessage(null)} className="text-teal-600 font-bold">
            ×
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-8">
        <button
          type="button"
          onClick={() => setActiveTab("volunteers")}
          className={`pb-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "volunteers"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Active Volunteers ({volunteers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("applications")}
          className={`pb-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "applications"
              ? "border-teal-600 text-teal-600"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          Application History ({applications.length})
        </button>
      </div>

      {/* Tab 1: Volunteers Directory */}
      {activeTab === "volunteers" && (
        <div className="space-y-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by code, bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
            />
          </div>

          <div className="bg-transparent md:bg-white md:rounded-2xl md:border md:border-gray-200 md:shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse block md:table">
              <thead className="hidden md:table-header-group">
                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                  <th className="py-3 px-6">Volunteer Code</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Total Hours</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm block md:table-row-group">
                {filteredVolunteers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500">
                      No volunteers match the current search.
                    </td>
                  </tr>
                ) : (
                  filteredVolunteers.map((vol) => (
                    <tr key={vol.id} className="hover:bg-gray-50/60 transition-colors block md:table-row border border-gray-200 md:border-none rounded-xl mb-4 md:mb-0 p-4 md:p-0 shadow-sm md:shadow-none bg-white md:bg-transparent">
                      <td data-label="Volunteer Code" className="py-2 md:py-4 px-0 md:px-6 font-bold text-gray-900 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 font-mono text-xs">
                          {vol.volunteer_code}
                        </span>
                      </td>
                      <td data-label="Status" className="py-2 md:py-4 px-0 md:px-6 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                          <ShieldCheck className="w-3 h-3" /> {vol.status}
                        </span>
                      </td>
                      <td data-label="Total Hours" className="py-2 md:py-4 px-0 md:px-6 font-bold text-teal-700 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                        {vol.total_hours || 0} hrs
                      </td>
                      <td className="py-3 md:py-4 px-0 md:px-6 text-left md:text-right space-x-2 block md:table-cell">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVolId(vol.id);
                            setModalType("program");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100"
                        >
                          + Program
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVolId(vol.id);
                            setModalType("event");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100"
                        >
                          + Event
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVolId(vol.id);
                            setModalType("hours");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold hover:bg-amber-100"
                        >
                          + Hours
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVolId(vol.id);
                            setModalType("certificate");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-semibold hover:bg-teal-100"
                        >
                          + Certificate
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Application History */}
      {activeTab === "applications" && (
        <div className="bg-transparent md:bg-white md:rounded-2xl md:border md:border-gray-200 md:shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 uppercase">
                <th className="py-3 px-6">Applicant</th>
                <th className="py-3 px-6">Contact</th>
                <th className="py-3 px-6">Occupation & City</th>
                <th className="py-3 px-6">Preferred Areas</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm block md:table-row-group">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-500">
                    No applications found in history.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50/60 transition-colors block md:table-row border border-gray-200 md:border-none rounded-xl mb-4 md:mb-0 p-4 md:p-0 shadow-sm md:shadow-none bg-white md:bg-transparent">
                    <td data-label="Applicant" className="py-2 md:py-4 px-0 md:px-6 font-bold text-gray-900 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      {app.full_name}
                      <p className="text-xs text-gray-500 font-normal mt-0.5 line-clamp-1">
                        {app.motivation}
                      </p>
                    </td>
                    <td data-label="Contact" className="py-2 md:py-4 px-0 md:px-6 text-gray-700 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      <p>{app.email}</p>
                      <p className="text-xs text-gray-500">{app.mobile_number}</p>
                    </td>
                    <td data-label="Occupation & City" className="py-2 md:py-4 px-0 md:px-6 text-gray-700 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      <p>{app.occupation}</p>
                      <p className="text-xs text-gray-500">
                        {app.city_district}, {app.state}
                      </p>
                    </td>
                    <td data-label="Preferred Areas" className="py-2 md:py-4 px-0 md:px-6 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      <div className="flex flex-wrap gap-1">
                        {(app.preferred_areas || []).slice(0, 2).map((a, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td data-label="Status" className="py-2 md:py-4 px-0 md:px-6 block md:table-cell before:content-[attr(data-label)] before:font-semibold before:text-gray-500 before:text-xs before:uppercase before:mb-1 before:block md:before:hidden">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          app.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : app.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 md:py-4 px-0 md:px-6 text-left md:text-right space-x-2 block md:table-cell">
                      {app.status === "pending" && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleReviewApp(app.id, "accepted")}
                            className="px-3 py-1 rounded-lg bg-green-600 text-white text-xs font-semibold hover:bg-green-700 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReviewApp(app.id, "rejected")}
                            className="px-3 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold hover:bg-red-200 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {app.status === "accepted" && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedVolId(app.id);
                            setProfileInput({
                              full_name: app.full_name,
                              occupation: app.occupation,
                              city_district: app.city_district,
                              state: app.state,
                              public_bio: app.public_bio || "",
                              volunteer_role: app.volunteer_role || "",
                              skills: app.skills || "",
                              is_publicly_visible: app.is_publicly_visible || false,
                              blood_group: app.blood_group || "",
                              profile_picture_url: app.profile_picture_url || "",
                            });
                            setModalType("profile");
                          }}
                          className="px-3 py-1 rounded-lg border border-teal-200 text-teal-700 bg-teal-50 text-xs font-semibold hover:bg-teal-100 transition-colors"
                        >
                          Edit Profile
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Action Modal */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4 capitalize">
              {modalType === "program" && "Assign Volunteer to Program"}
              {modalType === "event" && "Assign Volunteer to Event"}
              {modalType === "hours" && "Log Individual Activity Hours"}
              {modalType === "certificate" && "Issue Verified Certificate"}
              {modalType === "profile" && "Edit Volunteer Profile"}
            </h3>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              {(modalType === "program" || modalType === "event") && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {modalType === "program" ? "Program UUID" : "Event UUID"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 11111111-1111-1111-1111-111111111111"
                      value={targetId}
                      onChange={(e) => setTargetId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Assigned Role
                    </label>
                    <input
                      type="text"
                      required
                      value={roleInput}
                      onChange={(e) => setRoleInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </>
              )}

              {modalType === "hours" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Hours to Log
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="500"
                      required
                      value={hoursInput}
                      onChange={(e) => setHoursInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Activity Notes
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Community Teaching Session"
                      value={notesInput}
                      onChange={(e) => setNotesInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </>
              )}

              {modalType === "certificate" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Certificate Title
                    </label>
                    <input
                      type="text"
                      required
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Cloudflare R2 / Media File UUID
                    </label>
                    <input
                      type="text"
                      placeholder="UUID of uploaded media file in storage"
                      value={mediaIdInput}
                      onChange={(e) => setMediaIdInput(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>
                </>
              )}

              {modalType === "profile" && (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Profile Picture (Admin Upload)
                    </label>
                    <ImageUploader
                      folder="volunteers"
                      multiple={false}
                      maxFiles={1}
                      onUploadComplete={(result) => {
                        const resArray = Array.isArray(result) ? result : [result];
                        if (resArray?.[0]?.cdnUrl) {
                          setProfileInput(prev => ({ ...prev, profile_picture_url: resArray[0].cdnUrl }));
                        }
                      }}
                    />
                    {profileInput.profile_picture_url && (
                      <div className="mt-2 text-xs text-teal-600 font-medium truncate">
                        Current Image: {profileInput.profile_picture_url}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileInput.full_name || ""}
                      onChange={(e) => setProfileInput(prev => ({ ...prev, full_name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Occupation
                    </label>
                    <input
                      type="text"
                      required
                      value={profileInput.occupation || ""}
                      onChange={(e) => setProfileInput(prev => ({ ...prev, occupation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">City/District</label>
                      <input
                        type="text"
                        required
                        value={profileInput.city_district || ""}
                        onChange={(e) => setProfileInput(prev => ({ ...prev, city_district: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={profileInput.state || ""}
                        onChange={(e) => setProfileInput(prev => ({ ...prev, state: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Public Bio
                    </label>
                    <textarea
                      rows={3}
                      value={profileInput.public_bio || ""}
                      onChange={(e) => setProfileInput(prev => ({ ...prev, public_bio: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Volunteer Role
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Core Team, Event Organizer"
                      value={profileInput.volunteer_role || ""}
                      onChange={(e) => setProfileInput(prev => ({ ...prev, volunteer_role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Skills / Contribution Areas
                    </label>
                    <input
                      type="text"
                      value={profileInput.skills || ""}
                      onChange={(e) => setProfileInput(prev => ({ ...prev, skills: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    />
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
                    <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">Private Admin Area</h4>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Blood Group (Never Public)
                      </label>
                      <select
                        value={profileInput.blood_group || "Unknown"}
                        onChange={(e) => setProfileInput(prev => ({ ...prev, blood_group: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white"
                      >
                        <option value="Unknown">Unknown / Not Provided</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={profileInput.is_publicly_visible || false}
                      onChange={(e) => setProfileInput(prev => ({ ...prev, is_publicly_visible: e.target.checked }))}
                      className="w-4 h-4 text-teal-600 rounded"
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      Show Profile on Public Volunteers Page
                    </span>
                  </label>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setModalType(null);
                    setSelectedVolId(null);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-teal-600 text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Action"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
