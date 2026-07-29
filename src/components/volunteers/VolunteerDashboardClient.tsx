"use client";

import { Award, Calendar, Clock, Download, FileText, ShieldCheck, User } from "lucide-react";
import React, { useState } from "react";

import type {
  VolunteerDashboardData,
  ProgramVolunteerRow,
  EventVolunteerRow,
  VolunteerDocumentRow,
} from "@/features/volunteers/repository";

interface Props {
  initialData: VolunteerDashboardData;
}

export function VolunteerDashboardClient({ initialData }: Props) {
  const [activeTab, setActiveTab] = useState<"assignments" | "activity" | "certificates">("assignments");
  const { volunteer, programs, events, certificates, totalHours } = initialData;

  const activityLogs: Array<{ id: string; hours: number; notes: string; created_at: string }> =
    Array.isArray((volunteer.metadata as any)?.activity_logs) ? ((volunteer.metadata as any)?.activity_logs as any) : [];

  return (
    <div className="min-h-screen bg-[#F8FAF9] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Banner */}
        <div className="bg-white rounded-3xl border border-[#E6EBE9] shadow-sm p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006633] to-[#004D26] text-white flex items-center justify-center font-bold text-2xl shadow-lg">
              <User className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-[#17231D]">
                  Volunteer Profile
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#E8F2EC] text-[#006633] text-xs font-bold">
                  {volunteer.volunteer_code}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Volunteer
              </p>
              <p className="text-sm text-[#4F5E57]">
                {volunteer.bio || "Dedicated UDBHAV Foundation Changemaker"}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs font-semibold text-[#4F5E57]">
                <span className="inline-flex items-center gap-1 text-[#006633]">
                  <ShieldCheck className="w-3.5 h-3.5" /> Status: {volunteer.status}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Badges */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none bg-[#F3F7F5] rounded-2xl p-4 text-center min-w-[120px]">
              <div className="flex items-center justify-center gap-1 text-[#006633] mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xl font-extrabold">{totalHours}</span>
              </div>
              <span className="text-xs font-medium text-[#4F5E57]">Total Hours</span>
            </div>
            <div className="flex-1 md:flex-none bg-[#F3F7F5] rounded-2xl p-4 text-center min-w-[120px]">
              <div className="flex items-center justify-center gap-1 text-[#006633] mb-1">
                <Award className="w-4 h-4" />
                <span className="text-xl font-extrabold">{certificates.length}</span>
              </div>
              <span className="text-xs font-medium text-[#4F5E57]">Certificates</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#E6EBE9] mb-8 gap-6">
          <button
            type="button"
            onClick={() => setActiveTab("assignments")}
            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "assignments"
                ? "border-[#006633] text-[#006633]"
                : "border-transparent text-[#7A8A82] hover:text-[#17231D]"
            }`}
          >
            My Assignments ({programs.length + events.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("activity")}
            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "activity"
                ? "border-[#006633] text-[#006633]"
                : "border-transparent text-[#7A8A82] hover:text-[#17231D]"
            }`}
          >
            Activity & Hours ({activityLogs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("certificates")}
            className={`pb-4 text-sm font-bold border-b-2 transition-colors ${
              activeTab === "certificates"
                ? "border-[#006633] text-[#006633]"
                : "border-transparent text-[#7A8A82] hover:text-[#17231D]"
            }`}
          >
            Certificates & Documents ({certificates.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "assignments" && (
          <div className="space-y-8">
            {/* Program Assignments */}
            <div className="bg-white rounded-3xl border border-[#E6EBE9] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#17231D] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#006633]" /> Assigned Programs
              </h3>
              {programs.length === 0 ? (
                <p className="text-sm text-[#7A8A82] py-4">No active program assignments.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {programs.map((prog: ProgramVolunteerRow) => (
                    <div key={prog.id} className="p-4 rounded-2xl border border-[#E6EBE9] bg-[#F8FAF9] flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#17231D]">Program Assignment</h4>
                        <p className="text-xs text-[#4F5E57] mt-0.5">Role: {prog.role}</p>
                        <p className="text-xs text-[#7A8A82] mt-0.5">Started: {new Date(prog.start_date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#E8F2EC] text-[#006633] text-xs font-bold">
                          {prog.hours_contributed || 0} hrs
                        </span>
                        <p className="text-[11px] text-[#7A8A82] mt-1 capitalize">{prog.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Event Assignments */}
            <div className="bg-white rounded-3xl border border-[#E6EBE9] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#17231D] mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#006633]" /> Assigned Events
              </h3>
              {events.length === 0 ? (
                <p className="text-sm text-[#7A8A82] py-4">No active event assignments.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((evt: EventVolunteerRow) => (
                    <div key={evt.id} className="p-4 rounded-2xl border border-[#E6EBE9] bg-[#F8FAF9] flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#17231D]">Event Assignment</h4>
                        <p className="text-xs text-[#4F5E57] mt-0.5">Role: {evt.role}</p>
                        <p className="text-xs text-[#7A8A82] mt-0.5 capitalize">Attendance: {evt.attendance_status}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#E8F2EC] text-[#006633] text-xs font-bold">
                          {evt.hours_logged || 0} hrs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="bg-white rounded-3xl border border-[#E6EBE9] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#17231D] mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#006633]" /> Individual Activity Log
            </h3>
            {activityLogs.length === 0 ? (
              <p className="text-sm text-[#7A8A82] py-4">No individual hours logged yet.</p>
            ) : (
              <div className="space-y-4">
                {activityLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl border border-[#E6EBE9] flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#17231D]">{log.notes || "Volunteer Activity Contributed"}</p>
                      <p className="text-xs text-[#7A8A82] mt-0.5">
                        Logged on {new Date(log.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-[#E8F2EC] text-[#006633] font-bold text-sm">
                      +{log.hours} Hours
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="bg-white rounded-3xl border border-[#E6EBE9] p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#17231D] mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#006633]" /> Verified Certificates & Documents
            </h3>
            {certificates.length === 0 ? (
              <p className="text-sm text-[#7A8A82] py-4">No certificates issued yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert: VolunteerDocumentRow) => (
                  <div key={cert.id} className="p-4 rounded-2xl border border-[#E6EBE9] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E8F2EC] text-[#006633] flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#17231D]">UDBHAV Volunteer Certificate</h4>
                        <p className="text-xs text-[#7A8A82]">
                          Issued: {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : "Verified"}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`/api/media/${cert.media_file_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#006633] text-white text-xs font-semibold hover:bg-[#004D26] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> View / Download
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
