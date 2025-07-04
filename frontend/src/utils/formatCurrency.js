export const formatRupiah = (amount) => {
  if (!amount) return 'Rp 0';
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (number) => {
  if (!number) return '0';
  
  return new Intl.NumberFormat('id-ID').format(number);
}; 