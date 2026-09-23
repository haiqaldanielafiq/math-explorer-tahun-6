import fs from 'fs';
import path from 'path';
import { Topic } from '@/types';
import { INITIAL_TOPICS } from './seedData';

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE_PATH = path.join(DATA_DIR, 'topics.json');

// Memory cache fallback for environment where disk writing is read-only
let memoryTopicsStore: Topic[] | null = null;

function ensureDataFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify(INITIAL_TOPICS, null, 2), 'utf-8');
    }
  } catch (error) {
    console.warn('Storage helper: Could not initialize file system storage, falling back to memory cache.', error);
  }
}

export async function getTopics(): Promise<Topic[]> {
  try {
    ensureDataFile();
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, 'utf-8');
      const parsed = JSON.parse(data) as Topic[];
      memoryTopicsStore = parsed;
      return parsed;
    }
  } catch (error) {
    console.warn('Failed to read topics from file system:', error);
  }

  if (!memoryTopicsStore) {
    memoryTopicsStore = [...INITIAL_TOPICS];
  }
  return memoryTopicsStore;
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const topics = await getTopics();
  return topics.find((t) => t.slug === slug || t.id === slug) || null;
}

export async function saveTopics(topics: Topic[]): Promise<boolean> {
  memoryTopicsStore = topics;
  try {
    ensureDataFile();
    fs.writeFileSync(FILE_PATH, JSON.stringify(topics, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Failed to write topics to file system, stored in memory:', error);
    return true; // memory store holds it
  }
}

export async function createTopic(topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>): Promise<Topic> {
  const topics = await getTopics();
  const newTopic: Topic = {
    ...topic,
    id: `topic-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  topics.push(newTopic);
  await saveTopics(topics);
  return newTopic;
}

export async function updateTopic(id: string, updatedFields: Partial<Topic>): Promise<Topic | null> {
  const topics = await getTopics();
  const index = topics.findIndex((t) => t.id === id || t.slug === id);
  if (index === -1) return null;

  const updatedTopic: Topic = {
    ...topics[index],
    ...updatedFields,
    updatedAt: new Date().toISOString(),
  };

  topics[index] = updatedTopic;
  await saveTopics(topics);
  return updatedTopic;
}

export async function deleteTopic(id: string): Promise<boolean> {
  const topics = await getTopics();
  const filtered = topics.filter((t) => t.id !== id && t.slug !== id);
  if (filtered.length === topics.length) return false;

  await saveTopics(filtered);
  return true;
}
