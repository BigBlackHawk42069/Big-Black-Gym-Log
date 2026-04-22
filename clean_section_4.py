import re

with open('C:/Users/Ulyss/Documents/Desktop/Big Black Gym Log/BBGL Repo/Big-Black-Gym-Log/big-black-gym-log.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Split into sections
sec4_start = content.find('[SECTION IV]')
sec5_start = content.find('[SECTION V]')

if sec4_start == -1 or sec5_start == -1:
    print("Could not find sections")
    exit(1)

# Go back to the /** before [SECTION IV]
sec4_start_idx = content.rfind('/**', 0, sec4_start)
# Go back to the /** before [SECTION V]
sec5_start_idx = content.rfind('/**', 0, sec5_start)

pre_sec4 = content[:sec4_start_idx]
sec4 = content[sec4_start_idx:sec5_start_idx]
post_sec4 = content[sec5_start_idx:]

# Remove all single-line comments in Section 4
sec4 = re.sub(r'^[ \t]*//.*$\n', '', sec4, flags=re.MULTILINE)
sec4 = re.sub(r'[ \t]*//.*$', '', sec4, flags=re.MULTILINE)

# Remove the line with Network Layer
sec4 = re.sub(r'^[ \t]*// ─── Network Layer ──────────────────────────────────────────────────────\n?', '', sec4, flags=re.MULTILINE)

# Now inject the DBManager Transparency Note
db_note = """
    /*
     * TRANSPARENCY NOTE: STORAGE
     * The DBManager below handles saving your gym history.
     * All data is stored STRICTLY LOCALLY in your browser's IndexedDB ('bbgl_db').
     * Your data is NEVER uploaded to any external server or third-party database.
     */
    const DBManager"""
sec4 = sec4.replace("    const DBManager", db_note)

# Inject the universalFetch Transparency Note
fetch_note = """
    /*
     * TRANSPARENCY NOTE: NETWORK & API USAGE
     * The universalFetch function below is the ONLY place this script contacts the internet.
     * It connects STRICTLY to 'api.torn.com' and NEVER to any external servers.
     * It ONLY requests Log IDs 5300, 5301, 5302, 5303 (your Gym Training logs) and your 'battlestats'.
     * No other logs, items, money, or personal data are ever read or requested.
     */
    async function universalFetch"""
sec4 = sec4.replace("    async function universalFetch", fetch_note)

# Reassemble
new_content = pre_sec4 + sec4 + post_sec4

with open('C:/Users/Ulyss/Documents/Desktop/Big Black Gym Log/BBGL Repo/Big-Black-Gym-Log/big-black-gym-log.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Section 4 successfully updated.")
