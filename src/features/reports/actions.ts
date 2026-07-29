"use server";

import * as service from './service';

export async function fetchDonationsAction() {
  try {
    const data = await service.getDonationsReport();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function fetchContactsAction() {
  try {
    const data = await service.getContactsReport();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function fetchVolunteersAction() {
  try {
    const data = await service.getVolunteersReport();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function fetchUsersAction() {
  try {
    const data = await service.getUsersReport();
    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
