import * as repository from './repository';

export async function getDonationsReport() {
  return repository.fetchDonations();
}

export async function getContactsReport() {
  return repository.fetchContacts();
}

export async function getVolunteersReport() {
  return repository.fetchVolunteers();
}

export async function getUsersReport() {
  return repository.fetchUsers();
}
