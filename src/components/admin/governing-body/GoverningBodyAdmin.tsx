"use client";

import { Eye, EyeOff, Pencil, Plus, Trash2, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";

import { ImageUploader, type UploadedImage } from "@/components/admin/ImageUploader";
import type { GoverningBodyMemberRow } from "@/features/governing-body/repository";
import {
  addGoverningBodyMember,
  updateGoverningBodyMember,
  deleteGoverningBodyMember,
  toggleGoverningBodyMemberVisibility,
} from "@/features/governing-body/actions";

interface Props {
  initialMembers: GoverningBodyMemberRow[];
}

type ModalMode = null | "add" | "edit";

interface FormState {
  full_name: string;
  designation: string;
  bio: string;
  photo_url: string;
  display_order: number;
  is_active: boolean;
}

const emptyForm: FormState = {
  full_name: "",
  designation: "",
  bio: "",
  photo_url: "",
  display_order: 0,
  is_active: true,
};

export function GoverningBodyAdmin({ initialMembers }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string; photoUrl?: string | null } | null>(null);

  const members = initialMembers;

  function openAdd() {
    setForm({ ...emptyForm, display_order: (members.length > 0 ? Math.max(...members.map(m => m.display_order)) + 1 : 1) });
    setEditId(null);
    setModalMode("add");
  }

  function openEdit(member: GoverningBodyMemberRow) {
    setForm({
      full_name: member.full_name,
      designation: member.designation,
      bio: member.bio || "",
      photo_url: member.photo_url || "",
      display_order: member.display_order,
      is_active: member.is_active,
    });
    setEditId(member.id);
    setModalMode("edit");
  }

  function closeModal() {
    setModalMode(null);
    setEditId(null);
    setForm(emptyForm);
  }

  function handleUploadComplete(result: UploadedImage | UploadedImage[]) {
    const uploaded = Array.isArray(result) ? result[0] : result;
    if (uploaded?.cdnUrl) {
      setForm(prev => ({ ...prev, photo_url: uploaded.cdnUrl }));
    }
  }

  function handleSave() {
    if (!form.full_name.trim() || !form.designation.trim()) {
      toast.error("Name and Designation are required.");
      return;
    }
    startTransition(async () => {
      const data = {
        full_name: form.full_name.trim(),
        designation: form.designation.trim(),
        bio: form.bio.trim() || null,
        photo_url: form.photo_url.trim() || null,
        display_order: form.display_order,
        is_active: form.is_active,
      };

      let result;
      if (modalMode === "add") {
        result = await addGoverningBodyMember(data);
      } else if (modalMode === "edit" && editId) {
        result = await updateGoverningBodyMember(editId, data);
      }

      if (result?.success) {
        toast.success(modalMode === "add" ? "Member added successfully." : "Member updated successfully.");
        closeModal();
        router.refresh();
      } else {
        toast.error(result?.error || "Unable to save member. Please try again.");
      }
    });
  }

  function handleToggleVisibility(member: GoverningBodyMemberRow) {
    startTransition(async () => {
      const result = await toggleGoverningBodyMemberVisibility(member.id, !member.is_active);
      if (result.success) {
        toast.success(member.is_active ? "Member hidden from public page." : "Member shown on public page.");
        router.refresh();
      } else {
        toast.error(result.error || "Unable to update visibility.");
      }
    });
  }

  function handleDelete() {
    if (!deleteConfirm) return;
    startTransition(async () => {
      const result = await deleteGoverningBodyMember(deleteConfirm.id, deleteConfirm.photoUrl);
      if (result.success) {
        toast.success("Member removed successfully.");
        setDeleteConfirm(null);
        router.refresh();
      } else {
        toast.error(result.error || "Unable to delete member. Please try again.");
      }
    });
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{members.length} member{members.length !== 1 ? "s" : ""}</p>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#006633] text-white text-sm font-medium rounded-lg hover:bg-[#005528] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Photo</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Designation</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Order</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50/40 transition-colors group">
                  {/* Photo */}
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                      {member.photo_url ? (
                        <Image src={member.photo_url} alt={member.full_name} width={40} height={40} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </td>
                  {/* Name */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">{member.full_name}</span>
                  </td>
                  {/* Designation */}
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{member.designation}</span>
                  </td>
                  {/* Order */}
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-gray-500 font-mono">{member.display_order}</span>
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${member.is_active ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-100 text-gray-500 border border-gray-200"}`}>
                      {member.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => openEdit(member)}
                        disabled={isPending}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(member)}
                        disabled={isPending}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title={member.is_active ? "Hide" : "Show"}
                      >
                        {member.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ id: member.id, name: member.full_name, photoUrl: member.photo_url })}
                        disabled={isPending}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400">
                    No Governing Body members yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {modalMode === "add" ? "Add Governing Body Member" : "Edit Governing Body Member"}
              </h2>
            </div>
            <div className="p-6 space-y-5">
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Profile Photo</label>
                {form.photo_url && (
                  <div className="mb-3 flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={form.photo_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, photo_url: "" }))}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove Photo
                    </button>
                  </div>
                )}
                <ImageUploader folder="governing-body" onUploadComplete={handleUploadComplete} />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006633]/20 focus:border-[#006633]"
                  placeholder="e.g. RAJASHREE KAR"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                <input
                  type="text"
                  value={form.designation}
                  onChange={e => setForm(prev => ({ ...prev, designation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006633]/20 focus:border-[#006633]"
                  placeholder="e.g. Field Coordinator"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio (optional)</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006633]/20 focus:border-[#006633] resize-none"
                  placeholder="Short biography..."
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  min={1}
                  value={form.display_order}
                  onChange={e => setForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 1 }))}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#006633]/20 focus:border-[#006633]"
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={e => setForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="w-4 h-4 rounded border-gray-300 text-[#006633] focus:ring-[#006633]/20"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">Show on public page</label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                disabled={isPending}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="px-5 py-2 bg-[#006633] text-white text-sm font-medium rounded-lg hover:bg-[#005528] transition-colors disabled:opacity-50"
              >
                {isPending ? "Saving..." : modalMode === "add" ? "Add Member" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Member</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to remove <strong>{deleteConfirm.name}</strong> from the Governing Body?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={isPending}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-5 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isPending ? "Removing..." : "Remove Member"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
