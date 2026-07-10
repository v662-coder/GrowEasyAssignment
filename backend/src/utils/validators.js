export const validateCRMRecord = (record) => {
  // Check if record has email or mobile
  const hasEmail = record.email && record.email.trim().length > 0;
  const hasMobile =
    record.mobile_without_country_code &&
    record.mobile_without_country_code.trim().length > 0;

  if (!hasEmail && !hasMobile) {
    return false;
  }

  // Validate created_at
  if (record.created_at) {
    const date = new Date(record.created_at);
    if (isNaN(date.getTime())) {
      record.created_at = new Date().toISOString();
    }
  }

  // Validate crm_status
  const validStatuses = [
    "GOOD_LEAD_FOLLOW_UP",
    "DID_NOT_CONNECT",
    "BAD_LEAD",
    "SALE_DONE",
  ];

  if (record.crm_status && !validStatuses.includes(record.crm_status)) {
    delete record.crm_status;
  }

  // Validate data_source
  const validSources = [
    "leads_on_demand",
    "meridian_tower",
    "eden_park",
    "varah_swamy",
    "sarjapur_plots",
  ];

  if (record.data_source && !validSources.includes(record.data_source)) {
    delete record.data_source;
  }

  return true;
};
