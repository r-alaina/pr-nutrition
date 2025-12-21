import payload from 'payload';
import config from '@/payload.config';

const checkCategories = async () => {
  await payload.init({ config });
  const items = await payload.find({
    collection: 'menu-items',
    limit: 100,
  });
  const categories = new Set(items.docs.map(i => i.category));
  console.log('Available Categories:', Array.from(categories));
};

checkCategories();
