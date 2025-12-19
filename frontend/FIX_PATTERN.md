// Apply this pattern to all API calls:

// BEFORE:
// const res = await service.getAll();
// setData(res.data.data.content);

// AFTER:
// try {
//   const res = await service.getAll();
//   setData(res.data?.data?.content || []);
// } catch (err) {
//   console.error('Failed:', err);
// }

// For useEffect:
// service.getAll().then(res => {
//   if (res.data?.data?.content) {
//     setData(res.data.data.content);
//   }
// }).catch(err => console.error('Failed:', err));
