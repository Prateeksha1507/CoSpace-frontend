// FollowButton.jsx
import { useEffect, useState } from 'react';
import { doIFollow, unfollowOrg, followOrg } from '../api/followAPI';
import { fetchOrgFollowerCount } from '../api/orgAPI';
import { InlineSpinner } from './LoadingSpinner';

export default function FollowSection({ orgId }) {
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [error, setError] = useState("");

  
    useEffect(() => {
      (async () => {
        setError("");
        setFollowersCount(0);
  
        if (!orgId) {
          setError("Invalid organization ID.");
          return;
        }
  
        try {
          const count = await fetchOrgFollowerCount(orgId)

          setFollowersCount(typeof count === "number" ? count : 0);
        } catch (e) {
          setError(e?.message || "Failed to load organization.");
          setFollowersCount(0);
        }
      })();
    }, [orgId]);

    const handleFollowToggle = async () => {
    setLoading(true);
    try {
        if (following) {
            await unfollowOrg(orgId);
            setFollowing(false);
            setFollowersCount(followersCount-1)
        } else {
            await followOrg(orgId);
            setFollowing(true);
            setFollowersCount(followersCount+1)
        }
        } catch (error) {
        console.error('Error toggling follow:', error);
        } finally {
        setLoading(false);
        }
    };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await doIFollow(orgId);
        if (alive) setFollowing(Boolean(res?.following));
      } catch {
        if (alive) setFollowing(false);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [orgId]);

  return (
    <div style={{ display: 'flex' }}>
      <p className="org-followers">{followersCount} follower{followersCount === 1 ? "" : "s"}</p>
      <div className="org-actions">
        <button
          className="secondary-btn"
          onClick={handleFollowToggle}
          disabled={loading}
        >
          {loading ? <InlineSpinner label="" color="secondary" /> : (following ? 'Following' : 'Follow')}
        </button>
      </div>
    </div>
  );
}
