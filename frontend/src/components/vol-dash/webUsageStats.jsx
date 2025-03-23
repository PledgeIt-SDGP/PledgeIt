export const categories = [
    {
      label: 'Environment',
      value: 72.72,
    },
    {
      label: 'Health',
      value: 16.38,
    },
    {
      label: 'Community',
      value: 3.83,
    },
    {
      label: 'Animal Welfare',
      value: 2.42,
    },
    {
      label: 'Human Rights',
      value: 4.65,
    },
    {
      label: 'Disaster Relief',
      value: 4.65,
    },
    {
      label: 'LifeCycle',
      value: 4.65,
    },
    {
      label: 'Charity',
      value: 4.65,
    },


  ];
  
  
  
  const normalize = (v, v2) => Number.parseFloat(((v * v2) / 100).toFixed(2));
  
  export const Categories = [
    ...categories.map((v) => ({
      ...v,
      label: v.label === 'Other' ? 'Other (Desktop)' : v.label,
         })),
  ];
  
  export const valueFormatter = (item) => `${item.value}%`;