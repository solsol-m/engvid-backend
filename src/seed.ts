import { Model } from 'mongoose';

export async function seedDatabase(videoModel: Model<any>): Promise<void> {
  // كود لتفريغ قاعدة البيانات بناءً على طلبك للتخلص من الفيديوهات الوهمية
  await videoModel.deleteMany({});
  console.log('🗑️ تم تنظيف قاعدة البيانات بالكامل من الفيديوهات الوهمية');
}
