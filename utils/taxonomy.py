"""Rule-based content-type classifier for Fandom social posts.

Usage:
    from utils.taxonomy import classify_post, LABELS, LABEL_META

    label = classify_post(row)  # row: dict or pandas Series

Input fields (dict / Series keys):
    text_lower    – lowercased combined title + raw_content text
    title         – post title (str or None/NaN)
    tok           – whitespace-split token count (int)
    poll_count    – number of polls attached (int)
    image_count   – number of images attached (int)
    og_count      – number of open-graph links (int)
    post_role     – "op" or "reply" (str)
    content_type  – "text_only" | "media_only" | "text_plus_media" | "empty"
"""

import re
from typing import Any, Dict, Union

try:
    import pandas as pd
    _has_pandas = True
except ImportError:
    _has_pandas = False

Row = Union[Dict[str, Any], Any]  # dict or pandas Series

# ── All 19 taxonomy labels in priority order ──────────────────────────────────
LABELS = [
    "empty_or_noise",
    "poll_or_vote",
    "admin_or_announcement",
    "question_bug_report",
    "question_how_to",
    "question_lore",
    "question_general",
    "theory_or_speculation",
    "ranking_or_comparison",
    "opinion_or_reaction",
    "fan_creation_or_showcase",
    "trading_or_lfg",
    "meme_or_humor",
    "news_or_update_discussion",
    "media_share",
    "social_chatter",
    "short_reaction",
    "lore_or_wiki_discussion",
    "general_discussion",
]

# ── Precompiled regex patterns ─────────────────────────────────────────────────
_F = re.IGNORECASE

_ADMIN = [
    re.compile(r'\b(admin|moderator|mod team|wiki rules|guidelines|policy|announcement)\b', _F),
    re.compile(r'\b(disabling|enabling|new rule|rule change|ban|banned|warning)\b', _F),
    re.compile(r'\b(please read|reminder to all|attention everyone)\b', _F),
    re.compile(r'\b(closing this|locking this|pinned)\b', _F),
]

_QUESTION = [
    re.compile(r'^(who|what|where|when|why|how|is |are |do |does |did |can |could |should |would |will )', _F),
    re.compile(r'\?\s*$', _F),
    re.compile(r'\b(help|anyone know|does anyone|can someone|how do i|how to|need help|stuck on)\b', _F),
    re.compile(r"\b(explain|confused|don'?t understand|what does .+ mean)\b", _F),
]
_QUESTION_BUG   = re.compile(r"\b(bug|glitch|error|broken|doesn'?t work|not working|crash|lag)\b", _F)
_QUESTION_HOWTO = re.compile(r'\b(how to|how do|guide|tutorial|walkthrough|tips|strategy|best way)\b', _F)
_QUESTION_LORE  = re.compile(r'\b(lore|story|canon|timeline|explained|backstory)\b', _F)

_THEORY = [
    re.compile(r'\b(theory|theories|speculate|speculation|predict|prediction|foreshadow)\b', _F),
    re.compile(r'\b(i think .+ will|i believe .+ is|what if|hear me out|hot take|unpopular opinion)\b', _F),
    re.compile(r'\b(could .+ be|might .+ be|prob?ably going to)\b', _F),
]

_RANKING = [
    re.compile(r'\b(tier list|ranking|rank these|top \d|best .+ worst|who wins|who would win|vs\.?|versus)\b', _F),
    re.compile(r'\b(strongest|weakest|most powerful|overrated|underrated)\b', _F),
    re.compile(r'\b(favorite|favourite|least favorite|goat|the best)\b', _F),
]

_OPINION = [
    re.compile(r'\b(i think|imo|in my opinion|honestly|ngl|lowkey|fr |no cap)\b', _F),
    re.compile(r'\b(unpopular opinion|hot take|am i the only one|controversial)\b', _F),
    re.compile(r'\b(overrated|underrated|overhyped|slept on|mid |trash|goated|peak)\b', _F),
    re.compile(r'\b(anyone else|does anyone else|is it just me)\b', _F),
    re.compile(r'\b(love|hate|amazing|terrible|awful|incredible|disappointed|annoying)\b', _F),
]

_CREATIVE = [
    re.compile(r'\b(i made|i drew|my art|my oc|my fan ?art|my design|my build|my creation)\b', _F),
    re.compile(r'\b(fan ?art|fan fiction|fanfic|oc |original character|custom|redesign)\b', _F),
    re.compile(r'\b(drawing|sketch|commission|edit|wallpaper|render)\b', _F),
    re.compile(r'\b(i wrote|my story|fan ?fic)\b', _F),
]

_TRADING = [
    re.compile(r'\b(trad(?:e|ing)|looking for|lf |ft |wtt|wts|wtb|selling|buying)\b', _F),
    re.compile(r'\b(anyone want to|who wants to|add me|join my|group|server|dm me)\b', _F),
    re.compile(r'\b(give ?away|raffle|free .+ for)\b', _F),
]

_MEME = [
    re.compile(r'\b(lol|lmao|lmfao|bruh|meme|shitpost|real|its over)\b', _F),
    re.compile(r'(💀|😂|🤣)', _F),
    re.compile(r'\b(ratio|cope|seethe|based)\b', _F),
]

_NEWS = [
    re.compile(r'\b(new update|just released|patch|changelog|season \d|episode|chapter)\b', _F),
    re.compile(r'\b(trailer|teaser|leak|leaks|spoiler|confirmed|officially)\b', _F),
    re.compile(r'\b(coming soon|release date|announced|reveal)\b', _F),
]

_SOCIAL = [
    re.compile(r'\b(hi everyone|hello|hey guys|good morning|gm|gn|goodnight)\b', _F),
    re.compile(r"\b(bored|what'?s up|how are you|how'?s everyone|just saying)\b", _F),
    re.compile(r'\b(follow me|sub to|check out my|my channel|my youtube)\b', _F),
    re.compile(r'\b(happy birthday|rip|f in the chat|congrats)\b', _F),
]

_LORE = [
    re.compile(r'\b(lore|canon|timeline|backstory|plot hole|retcon)\b', _F),
    re.compile(r'\b(power ?level|ability|abilities|devil fruit|quirk|jutsu|force|spell)\b', _F),
    re.compile(r'\b(arc |saga|filler|chapter \d|episode \d)\b', _F),
]


def _count(patterns: list, text: str) -> int:
    """Count how many compiled patterns match in text."""
    return sum(1 for p in patterns if p.search(text))


def _is_na(val: Any) -> bool:
    if val is None:
        return True
    if _has_pandas and pd.isna(val):
        return True
    return False


def classify_post(row: Row) -> str:
    """Assign a content-type label to a post using rule-based priority cascade.

    First match wins. Returns one of the 19 LABELS strings.
    """
    if isinstance(row, dict):
        get = row.get
    else:
        # pandas Series
        def get(key, default=None):
            try:
                val = row[key]
                return default if _is_na(val) else val
            except (KeyError, IndexError):
                return default

    text = str(get("text_lower", "") or "")
    title_raw = get("title", None)
    title = str(title_raw).lower() if not _is_na(title_raw) else ""
    tok = int(get("tok", 0) or 0)
    has_poll = int(get("poll_count", 0) or 0) > 0
    has_image = int(get("image_count", 0) or 0) > 0
    is_op = str(get("post_role", "")) == "op"
    content_type = str(get("content_type", "") or "")
    has_og = int(get("og_count", 0) or 0) > 0

    # ── 0. Empty / ultra-short ────────────────────────────────────────────────
    if tok <= 1 and not has_image and not has_poll and not has_og:
        return "empty_or_noise"

    # ── 1. Poll ───────────────────────────────────────────────────────────────
    if has_poll:
        return "poll_or_vote"

    # ── 2. Admin / announcement ───────────────────────────────────────────────
    if _count(_ADMIN, text) >= 1:
        return "admin_or_announcement"

    # ── 3. Question / help-seeking ────────────────────────────────────────────
    q_score = _count(_QUESTION, text)
    if q_score >= 2 or (re.search(r'\?', title) and q_score >= 1):
        if _QUESTION_BUG.search(text):
            return "question_bug_report"
        if _QUESTION_HOWTO.search(text):
            return "question_how_to"
        if _QUESTION_LORE.search(text):
            return "question_lore"
        return "question_general"

    # ── 4. Theory / speculation ───────────────────────────────────────────────
    if _count(_THEORY, text) >= 1 and tok > 5:
        return "theory_or_speculation"

    # ── 5. Ranking / tier list ────────────────────────────────────────────────
    ranking_score = _count(_RANKING, text)
    if ranking_score >= 1 and (has_poll or is_op):
        return "ranking_or_comparison"

    # ── 6. Opinion (high confidence) ─────────────────────────────────────────
    opinion_score = _count(_OPINION, text)
    if opinion_score >= 2:
        return "opinion_or_reaction"

    # ── 7. Fan creation / art ─────────────────────────────────────────────────
    if _count(_CREATIVE, text) >= 1:
        return "fan_creation_or_showcase"

    # ── 8. Trading / LFG ─────────────────────────────────────────────────────
    if _count(_TRADING, text) >= 1:
        return "trading_or_lfg"

    # ── 9. Meme / humor ───────────────────────────────────────────────────────
    if _count(_MEME, text) >= 1 and tok < 20:
        return "meme_or_humor"

    # ── 10. News / update ─────────────────────────────────────────────────────
    if _count(_NEWS, text) >= 1:
        return "news_or_update_discussion"

    # ── 11. Media share ───────────────────────────────────────────────────────
    if content_type == "media_only" or (has_image and tok <= 5):
        return "media_share"

    # ── 12. Social chatter ────────────────────────────────────────────────────
    if _count(_SOCIAL, text) >= 1:
        return "social_chatter"

    # ── 13. Short reaction (replies only) ────────────────────────────────────
    if not is_op and tok <= 5:
        return "short_reaction"

    # ── 14. Lore / wiki content ───────────────────────────────────────────────
    if _count(_LORE, text) >= 1:
        return "lore_or_wiki_discussion"

    # ── 15. Opinion (lower confidence) ───────────────────────────────────────
    if opinion_score >= 1:
        return "opinion_or_reaction"

    # ── 16. Ranking (lower confidence) ───────────────────────────────────────
    if ranking_score >= 1:
        return "ranking_or_comparison"

    # ── Fallback ──────────────────────────────────────────────────────────────
    if tok <= 5:
        return "short_reaction"
    return "general_discussion"


# ── Label metadata ────────────────────────────────────────────────────────────
LABEL_META = {
    "empty_or_noise":            {"display": "Empty / Noise",           "description": "tok ≤ 1, no media"},
    "poll_or_vote":              {"display": "Poll / Vote",             "description": "Post contains a structured poll"},
    "admin_or_announcement":     {"display": "Admin / Announcement",    "description": "Mod/admin language or wiki rules"},
    "question_bug_report":       {"display": "Question – Bug Report",   "description": "Help-seeking + bug/glitch/error signals"},
    "question_how_to":           {"display": "Question – How-To",       "description": "Help-seeking + guide/tutorial signals"},
    "question_lore":             {"display": "Question – Lore",         "description": "Help-seeking + lore/canon/timeline signals"},
    "question_general":          {"display": "Question – General",      "description": "Generic help-seeking question"},
    "theory_or_speculation":     {"display": "Theory / Speculation",    "description": "Explicit theory or speculative language, tok > 5"},
    "ranking_or_comparison":     {"display": "Ranking / Comparison",    "description": "Tier lists, who-would-win, comparisons"},
    "opinion_or_reaction":       {"display": "Opinion / Reaction",      "description": "Strong opinion signals (imo, ngl, overrated…)"},
    "fan_creation_or_showcase":  {"display": "Fan Creation / Showcase", "description": "Sharing OC, fan art, fanfic, builds"},
    "trading_or_lfg":            {"display": "Trading / LFG",           "description": "Trade offers, looking for group, giveaways"},
    "meme_or_humor":             {"display": "Meme / Humor",            "description": "Humor signals + tok < 20"},
    "news_or_update_discussion": {"display": "News / Update",           "description": "Game patches, trailers, leaks, confirmed news"},
    "media_share":               {"display": "Media Share",             "description": "Image-only or near-image-only post"},
    "social_chatter":            {"display": "Social Chatter",          "description": "Off-topic social interaction"},
    "short_reaction":            {"display": "Short Reaction",          "description": "Reply with ≤ 5 tokens"},
    "lore_or_wiki_discussion":   {"display": "Lore / Wiki Discussion",  "description": "Lore, canon, power levels, abilities"},
    "general_discussion":        {"display": "General Discussion",      "description": "On-topic discussion, no specific signal match"},
}
