import { NextRequest, NextResponse } from 'next/server';
import { getWhopClient } from '@/lib/whop';



export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const companyId = searchParams.get('companyId');

    const whopClient = getWhopClient();

    // ─── 1. Kurs Bilgisi ───────────────────────────────────────────────────────
    if (courseId) {
      // Belirli bir kurs için detaylı veri çek
      const [course, studentsPage] = await Promise.all([
        whopClient.courses.retrieve(courseId),
        whopClient.courseStudents.list({ course_id: courseId, first: 100 }),
      ]);

      const students = studentsPage.data ?? [];
      const totalStudents = students.length;

      // Tamamlama oranları
      const completionRates = students.map((s) => {
        if (s.total_lessons_count === 0) return 0;
        return (s.completed_lessons_count / s.total_lessons_count) * 100;
      });
      const avgCompletion = completionRates.length
        ? Math.round(completionRates.reduce((a, b) => a + b, 0) / completionRates.length)
        : 0;

      // Churn riski: Son 7 günde hiç ilerleme kaydetmeyenler
      const atRiskStudents = students.filter((s) => {
        // Tamamlanmamış ama hiç ilerleme yoksa risk altında
        return s.completed_lessons_count === 0;
      });

      return NextResponse.json({
        courseId,
        courseName: course.title ?? 'My Course',
        totalStudents,
        avgCompletion,
        atRiskCount: atRiskStudents.length,
        atRiskPercent: totalStudents > 0
          ? Math.round((atRiskStudents.length / totalStudents) * 100)
          : 0,
        chapterCount: course.chapters?.length ?? 0,
        lessonCount: course.chapters?.reduce(
          (sum, ch) => sum + (ch.lessons?.length ?? 0), 0
        ) ?? 0,
      });
    }

    // ─── 2. Şirketin Tüm Kursları ─────────────────────────────────────────────
    if (companyId) {
      const coursesPage = await whopClient.courses.list({ company_id: companyId });
      const courses = coursesPage.data ?? [];

      return NextResponse.json({
        companyId,
        totalCourses: courses.length,
        // List endpoint chapters döndürmüyor — detaylı chapterCount için /api/metrics?courseId=...
        courses: courses.map((c) => ({
          id: c.id,
          title: c.title,
        })),
      });
    }

    return NextResponse.json({ error: 'courseId veya companyId gerekli' }, { status: 400 });
  } catch (error) {
    console.error('Whop API error:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
