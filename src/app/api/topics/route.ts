import { NextResponse } from 'next/server';
import { getTopics, createTopic } from '@/lib/storage';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const topics = await getTopics();
    return NextResponse.json({ success: true, data: topics });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil senarai topik.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Akses tidak dibenarkan. Sila log masuk sebagai pentadbir.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    if (!body.title || !body.code) {
      return NextResponse.json(
        { success: false, error: 'Tajuk dan Kod DSKP diperlukan.' },
        { status: 400 }
      );
    }

    const slug = body.slug || body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newTopic = await createTopic({
      slug,
      title: body.title,
      code: body.code,
      standardKandungan: body.standardKandungan || '',
      standardPembelajaran: body.standardPembelajaran || '',
      description: body.description || '',
      objectives: body.objectives || [],
      published: body.published ?? false,
      order: body.order || 99,
      sections: body.sections || [],
      activity: body.activity || {
        id: `act-${Date.now()}`,
        title: 'Aktiviti Baru',
        description: '',
        totalQuantity: 20,
        initialData: [],
        questions: []
      },
      quiz: body.quiz || {
        id: `quiz-${Date.now()}`,
        title: 'Kuiz Baru',
        passingScore: 70,
        questions: []
      }
    });

    return NextResponse.json({ success: true, data: newTopic }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal merakam topik baru.' },
      { status: 500 }
    );
  }
}
