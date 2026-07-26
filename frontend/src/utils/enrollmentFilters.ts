/**
 * Filtering for the admin Enrollment Management list.
 *
 * Kept out of the component so the behaviour can be tested directly - the
 * previous inline version had an early `return true` that silently bypassed
 * every filter whenever the search box was empty.
 */

export interface EnrollmentRequest {
  _id?: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  city?: string;
  courseTitle?: string;
  paymentStatus?: string;
  contactStatus?: string;
  batch?: { _id?: string; name?: string } | string | null;
}

export interface EnrollmentFilters {
  searchTerm: string;
  selectedBatch: string;
  /** "all" | "collected" | "not_collected" | "failed" */
  paymentFilter: string;
  /** "all" | "not_contacted" | "contacted" | "follow_up" | "not_interested" */
  contactFilter: string;
}

export const matchesSearch = (form: EnrollmentRequest, searchTerm: string): boolean => {
  const term = (searchTerm || '').trim().toLowerCase();
  if (!term) return true;
  return [form.fullName, form.email, form.city, form.courseTitle]
    .some((v) => !!v && v.toLowerCase().includes(term))
    || [form.mobileNumber, form.whatsappNumber].some((v) => !!v && v.includes(term));
};

export const matchesBatch = (form: EnrollmentRequest, selectedBatch: string): boolean => {
  if (selectedBatch === 'all') return true;
  if (selectedBatch === 'no-batch') return !form.batch;
  if (form.batch && typeof form.batch === 'object') return form.batch._id === selectedBatch;
  return form.batch === selectedBatch;
};

export const matchesPayment = (form: EnrollmentRequest, paymentFilter: string): boolean => {
  // Anything not explicitly completed or failed is "not collected yet".
  const payment = form.paymentStatus || 'pending';
  switch (paymentFilter) {
    case 'all':
      return true;
    case 'collected':
      return payment === 'completed';
    case 'not_collected':
      return payment === 'pending';
    case 'failed':
      return payment === 'failed';
    default:
      return true;
  }
};

export const matchesContact = (form: EnrollmentRequest, contactFilter: string): boolean =>
  contactFilter === 'all' || (form.contactStatus || 'not_contacted') === contactFilter;

/** Applies every filter. All conditions must hold. */
export const filterEnrollmentRequests = <T extends EnrollmentRequest>(
  forms: T[],
  filters: EnrollmentFilters
): T[] =>
  (forms || []).filter(
    (form) =>
      matchesSearch(form, filters.searchTerm) &&
      matchesBatch(form, filters.selectedBatch) &&
      matchesPayment(form, filters.paymentFilter) &&
      matchesContact(form, filters.contactFilter)
  );

/** Counts for the payment summary tiles. */
export const countPaymentStatuses = (forms: EnrollmentRequest[]) => ({
  total: (forms || []).length,
  collected: (forms || []).filter((f) => f.paymentStatus === 'completed').length,
  notCollected: (forms || []).filter((f) => (f.paymentStatus || 'pending') === 'pending').length,
  failed: (forms || []).filter((f) => f.paymentStatus === 'failed').length,
});
