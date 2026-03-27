'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCRM } from '@/context/CRMContext';
import { INTERVIEW_QUESTIONS } from '@/data/crm-data';

const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200&q=80',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=1200&q=80',
  'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=1200&q=80',
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80',
];

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .substring(0, 60);
}

export default function CreateSpotlightPage({ searchParams }: { searchParams: Promise<{ interviewId?: string }> }) {
  const router = useRouter();
  const { interviews, businesses, updateInterview } = useCRM();
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    coverImage: UNSPLASH_IMAGES[0],
    neighborhood: '',
    category: 'spotlight',
  });

  useEffect(() => {
    searchParams.then(params => {
      if (params.interviewId) {
        setInterviewId(params.interviewId);
      }
    });
  }, [searchParams]);

  const interview = interviews.find(i => i.id === interviewId);
  const business = interview ? businesses.find(b => b.id === interview.businessId) : null;

  useEffect(() => {
    if (interview && business) {
      setFormData(prev => ({
        ...prev,
        title: `Spotlight: ${business.name}`,
        excerpt: `Discover what makes ${business.name} special in San Francisco's vibrant ${business.neighborhood} neighborhood.`,
        neighborhood: business.neighborhood,
      }));
    }
  }, [interview, business]);

  if (!interview || !business) {
    return (
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/outreach" className="text-primary hover:underline text-sm mb-4 inline-flex items-center gap-1">
          ← Back to Outreach
        </Link>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 mb-4">No interview selected.</p>
          <Link href="/admin/outreach" className="text-accent hover:underline">
            Go to Outreach →
          </Link>
        </div>
      </div>
    );
  }

  const answeredQuestions = Object.entries(interview.responses).filter(([, answer]) => answer);

  const generateArticleContent = () => {
    let content = '';
    
    answeredQuestions.forEach(([key, answer], index) => {
      const q = INTERVIEW_QUESTIONS[key as keyof typeof INTERVIEW_QUESTIONS];
      if (!q) return;
      
      const qIndex = parseInt(key.replace('q', ''));
      let sectionTitle = '';
      
      switch (qIndex) {
        case 1:
          sectionTitle = 'The Story Behind the Business';
          break;
        case 2:
          sectionTitle = 'What Sets Them Apart';
          break;
        case 3:
          sectionTitle = 'A Memorable Moment';
          break;
        case 4:
          sectionTitle = `About ${business.neighborhood}`;
          break;
        case 5:
          sectionTitle = 'Must-Try Experiences';
          break;
        default:
          sectionTitle = `Question ${qIndex}`;
      }
      
      content += `<h2>${sectionTitle}</h2>\n`;
      content += `<p>"${answer}"</p>\n\n`;
    });
    
    if (interview.images && interview.images.length > 0) {
      content += `<h2>A Visual Journey</h2>\n`;
      content += `<p>${business.name} is proud to share these glimpses into their space and offerings.</p>\n\n`;
    }
    
    content += `<h2>Visit ${business.name}</h2>\n`;
    content += `<p>Located at ${business.address} in ${business.neighborhood}, ${business.name} welcomes visitors with open arms. `;
    if (business.phone) {
      content += `Call them at ${business.phone} or `;
    }
    if (business.website) {
      content += `visit their <a href="${business.website}" target="_blank" rel="noopener">website</a> to `;
    }
    content += `learn more.</p>\n`;
    
    if (business.social?.instagram) {
      content += `\n<p>Follow them on <a href="${business.social.instagram}" target="_blank" rel="noopener">Instagram</a> for the latest updates.</p>\n`;
    }
    
    return content;
  };

  const handleSave = () => {
    setSaving(true);
    
    setTimeout(() => {
      updateInterview(interview.id, {
        status: 'published',
        articleId: generateSlug(formData.title),
      });
      
      setSaving(false);
      setSaved(true);
      
      setTimeout(() => {
        router.push('/admin/outreach');
      }, 1500);
    }, 1000);
  };

  const wordCount = (interview.responses.q1 || '').split(' ').length +
                    (interview.responses.q2 || '').split(' ').length +
                    (interview.responses.q3 || '').split(' ').length +
                    (interview.responses.q4 || '').split(' ').length +
                    (interview.responses.q5 || '').split(' ').length;

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/admin/outreach" className="text-primary hover:underline text-sm mb-4 inline-flex items-center gap-1">
        ← Back to Outreach
      </Link>
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary font-display">Create Spotlight Article</h1>
          <p className="text-muted mt-1">Convert {business.name}&apos;s interview into a published article</p>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium">
          {answeredQuestions.length} of 5 questions answered
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-primary mb-4">Article Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="Enter article title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                  placeholder="Brief description of the article..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Neighborhood</label>
                  <input
                    type="text"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="spotlight">Spotlight</option>
                    <option value="restaurants">Restaurants</option>
                    <option value="cafes">Cafes</option>
                    <option value="shopping">Shopping</option>
                    <option value="attractions">Attractions</option>
                    <option value="bars">Bars</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-primary mb-4">Interview Responses</h2>
            <div className="space-y-4">
              {answeredQuestions.map(([key, answer]) => {
                const qIndex = parseInt(key.replace('q', ''));
                let sectionTitle = '';
                switch (qIndex) {
                  case 1: sectionTitle = 'The Story Behind the Business'; break;
                  case 2: sectionTitle = 'What Sets Them Apart'; break;
                  case 3: sectionTitle = 'A Memorable Moment'; break;
                  case 4: sectionTitle = `About ${business.neighborhood}`; break;
                  case 5: sectionTitle = 'Must-Try Experiences'; break;
                }
                
                return (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-xs text-gray-500 mb-1">Question {qIndex}</p>
                    <p className="font-medium text-primary text-sm mb-2">{sectionTitle}</p>
                    <p className="text-gray-700 text-sm italic">"{answer}"</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-primary mb-4">Cover Image</h2>
            <div className="grid grid-cols-2 gap-2">
              {UNSPLASH_IMAGES.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setFormData({ ...formData, coverImage: img })}
                  className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    formData.coverImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <Image src={img} alt={`Option ${i + 1}`} fill className="object-cover" sizes="150px" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-primary mb-4">Article Preview</h2>
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
              <Image
                src={formData.coverImage}
                alt="Cover"
                fill
                className="object-cover"
                sizes="400px"
              />
            </div>
            <span className="text-accent text-xs font-semibold">{formData.neighborhood || 'Neighborhood'}</span>
            <h3 className="font-display text-primary text-base mt-1 leading-snug line-clamp-2">
              {formData.title || 'Article Title'}
            </h3>
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {formData.excerpt || 'Article excerpt will appear here...'}
            </p>
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
              <span>LocalWorld Spotlight</span>
              <span>•</span>
              <span>~{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-white">
            <h3 className="font-bold mb-2">Ready to Publish?</h3>
            <p className="text-sm text-white/80 mb-4">
              This will publish the article and mark the interview as complete.
            </p>
            {saved ? (
              <div className="flex items-center gap-2 text-green-300">
                <span className="text-xl">✓</span>
                <span className="font-medium">Published! Redirecting...</span>
              </div>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving || !formData.title}
                className="w-full px-4 py-2.5 bg-white text-primary rounded-lg font-medium hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Publish Spotlight
                  </>
                )}
              </button>
            )}
          </div>

          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-700 mb-2">Business Info</p>
            <p><strong>{business.name}</strong></p>
            <p>{business.address}</p>
            {business.website && (
              <a href={business.website} target="_blank" rel="noopener" className="text-accent hover:underline">
                {business.website}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
