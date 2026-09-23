import { NextResponse } from 'next/server';
import { getTopicBySlug, updateTopic, deleteTopic } from '@/lib/storage';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const topic = await getTopicBySlug(id);

    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'Topik tidak dijumpai.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: topic });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengambil maklumat topik.' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Akses tidak dibenarkan. Sila log masuk sebagai pentadbir.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const updated = await updateTopic(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Topik tidak wujud untuk dikemaskini.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal mengemaskini topik.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Akses tidak dibenarkan. Sila log masuk sebagai pentadbir.' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const deleted = await deleteTopic(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Topik tidak wujud.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Topik berjaya dipadam.' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Gagal memadam topik.' },
      { status: 500 }
    );
  }
}
