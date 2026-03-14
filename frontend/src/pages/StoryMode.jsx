import React, { useState, useEffect } from 'react';
import { getStories, getStory, getComments, addComment } from '../services/api';
import { useAuth } from '../context/AuthContext';

// Fallback stories shown when the backend is offline
const SAMPLE_STORIES = [
  {
    id: 'story-1',
    title: 'The Warming Arctic: A Race Against Time',
    region: 'Arctic Circle',
    variable: 'temperature',
    description: 'Arctic temperatures are rising four times faster than the global average. This story explores the cascading effects on sea ice, permafrost, and global weather patterns.',
    highlight: 'The Arctic could be ice-free in summer as early as 2035, fundamentally altering ecosystems and global ocean circulation.',
    centerLat: '78.2', centerLon: '15.5',
    newsKeywords: ['arctic warming', 'sea ice', 'permafrost'],
  },
  {
    id: 'story-2',
    title: 'Monsoon Extremes: Too Much, Too Little',
    region: 'South Asia',
    variable: 'precipitation',
    description: 'Climate change is intensifying South Asian monsoon variability, bringing devastating floods to some regions while creating severe drought conditions in others.',
    highlight: 'Extreme precipitation events have increased 30% in frequency since 2000 across South Asia.',
    centerLat: '20.5', centerLon: '78.9',
    newsKeywords: ['India floods', 'monsoon', 'drought'],
  },
  {
    id: 'story-3',
    title: 'Ocean Heat Content: The Hidden Crisis',
    region: 'Global Oceans',
    variable: 'temperature',
    description: 'The oceans have absorbed over 90% of the excess heat trapped by greenhouse gases. As ocean heat content rises, we see intensified hurricanes, coral bleaching, and sea-level rise.',
    highlight: 'Ocean heat content in 2026 surpassed all previous records, with the top 2000m of ocean absorbing unprecedented amounts of thermal energy.',
    centerLat: '0', centerLon: '-30',
    newsKeywords: ['sea level rise', 'coral bleaching', 'ocean warming'],
  },
];

// Tag colour map
const TAG_COLORS = {
  temperature: 'bg-orange-500',
  precipitation: 'bg-emerald-500',
  arctic: 'bg-primary',
};

const StoryMode = () => {
  const { user, token } = useAuth();

  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [storiesError, setStoriesError] = useState('');

  const [activeStory, setActiveStory] = useState(null);
  const [loadingStory, setLoadingStory] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Load story list on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getStories();
        setStories(Array.isArray(data) && data.length > 0 ? data : SAMPLE_STORIES);
      } catch {
        // Backend offline — use sample stories silently
        setStories(SAMPLE_STORIES);
      } finally {
        setLoadingStories(false);
      }
    };
    load();
  }, []);

  // Load a single story + its comments
  const openStory = async (id) => {
    setLoadingStory(true);
    setActiveStory(null);
    setComments([]);
    setCommentError('');
    try {
      const [storyData, commentsData] = await Promise.all([
        getStory(id),
        token ? getComments({ storyId: id }).catch(() => []) : Promise.resolve([]),
      ]);
      setActiveStory(storyData);
      setComments(commentsData);
    } catch (err) {
      setStoriesError(err.message || 'Failed to load story.');
    } finally {
      setLoadingStory(false);
    }
  };

  const closeStory = () => {
    setActiveStory(null);
    setComments([]);
    setCommentText('');
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    setCommentError('');
    try {
      const newComment = await addComment({ storyId: activeStory.id, text: commentText.trim() });
      setComments((prev) => [newComment, ...prev]);
      setCommentText('');
    } catch (err) {
      setCommentError(err.message || 'Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const tagColor = (variable) =>
    TAG_COLORS[variable] || 'bg-slate-500';

  return (
    <>
      {/* TopBar */}
      <header className="h-[60px] border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20 shrink-0">
        <div className="flex-1 max-w-xl">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
            <input
              readOnly
              className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary"
              placeholder="Search stories, regions, or data sets..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            <span className="material-symbols-outlined">notifications</span>
          </button>
        </div>
      </header>

      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 font-display">Climate Stories</h1>
          <p className="text-slate-500 text-lg">Guided data narratives for everyone</p>
        </div>

        {/* Error */}
        {storiesError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{storiesError}</div>
        )}

        {/* Loading */}
        {loadingStories && (
          <div className="flex items-center justify-center h-48 text-slate-400">
            <span className="material-symbols-outlined animate-spin mr-2">autorenew</span> Loading stories…
          </div>
        )}

        {/* Story Cards Grid */}
        {!loadingStories && stories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {stories.map((story) => (
              <div
                key={story.id}
                className="group bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-video relative overflow-hidden bg-slate-200 dark:bg-slate-800">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent z-10"></div>
                  {/* Placeholder gradient based on variable */}
                  <div
                    className="w-full h-full"
                    style={{
                      background:
                        story.variable === 'temperature'
                          ? 'linear-gradient(135deg, #0f172a 0%, #7c3aed 50%, #f59e0b 100%)'
                          : story.variable === 'precipitation'
                          ? 'linear-gradient(135deg, #0f172a 0%, #0284c7 50%, #10b981 100%)'
                          : 'linear-gradient(135deg, #0f172a 0%, #2563eb 100%)',
                    }}
                  />
                  <span className={`absolute top-4 left-4 ${tagColor(story.variable)} text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider z-20`}>
                    {story.variable}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{story.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-3 line-clamp-2">{story.description}</p>
                  <p className="text-[11px] text-slate-400 mb-4 font-mono">{story.region}</p>
                  <button
                    id={`story-explore-${story.id}`}
                    onClick={() => openStory(story.id)}
                    className="inline-flex items-center text-primary font-bold text-sm hover:underline"
                  >
                    Explore Story{' '}
                    <span className="material-symbols-outlined ml-1 text-base">arrow_forward</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Story Detail View */}
        {loadingStory && (
          <div className="flex items-center justify-center h-48 text-slate-400">
            <span className="material-symbols-outlined animate-spin mr-2">autorenew</span> Loading story…
          </div>
        )}

        {activeStory && !loadingStory && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl mb-12">
            {/* Story Header */}
            <div className="h-16 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between px-4 sm:px-8 border-b border-slate-100 dark:border-slate-800">
              <button
                id="story-close"
                onClick={closeStory}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <h2 className="font-bold text-lg text-slate-800 dark:text-white">{activeStory.title}</h2>
              <span className="text-xs text-slate-400 font-mono hidden sm:block uppercase">{activeStory.region}</span>
            </div>

            {/* Story Content */}
            <div className="flex flex-col lg:flex-row">
              {/* Text */}
              <div className="w-full lg:w-3/5 p-6 sm:p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800">
                <span className="text-primary font-bold text-xs uppercase tracking-widest mb-4 block">{activeStory.variable}</span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-6 leading-tight">{activeStory.title}</h2>
                <p className="text-base leading-relaxed text-slate-600 dark:text-slate-400 mb-6">{activeStory.description}</p>
                {activeStory.highlight && (
                  <div className="bg-primary/5 border-l-4 border-primary p-4 sm:p-6 rounded-r-xl mb-6">
                    <p className="italic text-primary-900 dark:text-primary-100 text-sm">{activeStory.highlight}</p>
                  </div>
                )}
                {activeStory.newsKeywords && (
                  <div className="flex flex-wrap gap-2">
                    {activeStory.newsKeywords.map((kw) => (
                      <span key={kw} className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase">{kw}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Visual column */}
              <div className="w-full lg:w-2/5 bg-slate-50 dark:bg-slate-950/50 p-6 sm:p-8 lg:p-12 flex flex-col gap-8">
                {/* Globe centred on story */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-sm">Focus Region</h4>
                    <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono">
                      {activeStory.centerLat}°N, {activeStory.centerLon}°E
                    </span>
                  </div>
                  <div
                    className="aspect-square rounded-xl overflow-hidden relative"
                    style={{
                      background:
                        activeStory.variable === 'temperature'
                          ? 'radial-gradient(circle at 60% 40%, #f43f5e 0%, transparent 40%), radial-gradient(circle at 30% 60%, #fb923c 0%, transparent 50%), #1e293b'
                          : 'radial-gradient(circle at 40% 50%, #0ea5e9 0%, transparent 50%), radial-gradient(circle at 65% 30%, #10b981 0%, transparent 40%), #1e293b',
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-white/20 text-9xl">public</span>
                    </div>
                  </div>
                </div>

                {/* Comments panel */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-lg">chat_bubble</span>
                    Discussion ({comments.length})
                  </h4>

                  {/* Comment form */}
                  {token ? (
                    <form onSubmit={handleAddComment} className="mb-4">
                      <textarea
                        id="comment-input"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment or annotation…"
                        rows={2}
                        className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none mb-2"
                        required
                      />
                      {commentError && <p className="text-xs text-red-500 mb-2">{commentError}</p>}
                      <button
                        id="comment-submit"
                        type="submit"
                        disabled={submittingComment}
                        className="w-full bg-primary text-white text-xs font-bold py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
                      >
                        {submittingComment ? 'Posting…' : 'Post Comment'}
                      </button>
                    </form>
                  ) : (
                    <p className="text-xs text-slate-400 mb-4">Sign in to leave a comment.</p>
                  )}

                  {/* Comment list */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {comments.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-4">No comments yet.</p>
                    )}
                    {comments.map((c) => (
                      <div key={c._id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <p className="text-xs font-bold text-slate-600 dark:text-slate-300">{c.author?.name || 'Anonymous'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{c.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default StoryMode;
