// Family-friendly 5-letter words tagged by reading grade level.
// Grade 2: everyday words a 7-8 year old reads confidently
// Grade 3: words encountered in school reading by age 8-9
// Grade 4: more advanced vocabulary for ages 9-10
// Selecting a grade includes that grade and all below it.

const WORD_GRADES = {
  2: [
    "ACORN", "ADDED", "AFTER", "AGAIN", "ALIVE", "ALONE", "ALONG", "ANGEL",
    "ANGRY", "APPLE", "ARROW", "ATTIC", "AWAKE", "AWFUL",
    "BACON", "BAGEL", "BEACH", "BEADS", "BEARS", "BENCH", "BERRY", "BIKES",
    "BIRDS", "BLACK", "BLANK", "BLIND", "BLOCK", "BLOOM", "BLOWN", "BOARD",
    "BORED", "BRAVE", "BREAD", "BREAK", "BRICK", "BRING", "BROOM", "BROWN",
    "BRUSH", "BUDDY", "BUILD", "BUILT", "BUNCH", "BUNNY", "BURST",
    "CABIN", "CAKES", "CAMEL", "CANDY", "CANOE", "CARDS", "CARRY", "CATCH",
    "CAVES", "CHAIR", "CHALK", "CHASE", "CHECK", "CHEER", "CHEST", "CHICK",
    "CLEAN", "CLEAR", "CLIMB", "CLOCK", "CLOSE", "CLOTH", "CLOUD", "CLOWN",
    "COACH", "COLOR", "COMIC", "COUNT", "COVER", "CRANE", "CREAM", "CROSS",
    "CROWD", "CROWN", "CRUSH",
    "DADDY", "DAISY", "DANCE", "DIZZY", "DOING", "DREAM", "DRESS", "DRINK",
    "DRIVE", "DRUMS",
    "EAGLE", "EARLY", "EARTH", "EIGHT", "ELBOW", "EMPTY", "ENJOY", "EQUAL",
    "EVERY", "EXACT",
    "FAIRY", "FANCY", "FEAST", "FIELD", "FIFTY", "FIGHT", "FINAL", "FIRST",
    "FIXED", "FLAME", "FLASH", "FLOCK", "FLOOD", "FLOOR", "FLOSS", "FLOUR",
    "FLUTE", "FOGGY", "FORCE", "FOUND", "FRESH", "FROZE", "FRUIT", "FUNNY",
    "FUZZY",
    "GAMES", "GIANT", "GIVEN", "GLASS", "GLOBE", "GLOVE", "GOING", "GRADE",
    "GRAND", "GRAPE", "GRASS", "GREAT", "GREEN", "GRILL", "GROUP", "GROWL",
    "GROWN", "GUARD", "GUIDE",
    "HANDY", "HAPPY", "HEART", "HEAVY", "HELLO", "HELPS", "HILLS", "HIPPO",
    "HOBBY", "HOLLY", "HOMES", "HONEY", "HORSE", "HOTEL", "HOURS", "HOUSE",
    "HUMAN", "HUMOR",
    "JELLY", "JOLLY", "JUDGE", "JUICE", "JUICY", "JUMBO", "JUMPY",
    "KITTY", "KNIFE", "KNOCK", "KNOWN",
    "LARGE", "LATER", "LAUGH", "LEARN", "LEAVE", "LEMON", "LEVEL", "LIGHT",
    "LIONS", "LOOPS", "LOOSE", "LUCKY", "LUNCH",
    "MAGIC", "MAPLE", "MARCH", "MANGO", "MATCH", "MEDAL", "MELON", "MERRY",
    "MIGHT", "MIXED", "MONEY", "MONTH", "MOODY", "MOONS", "MOSSY", "MOUNT",
    "MOUSE", "MOVED", "MOVIE", "MUDDY", "MUNCH", "MUSIC",
    "NIGHT", "NINJA", "NORTH", "NURSE",
    "OCEAN", "OFFER", "OFTEN", "OLIVE", "ONION", "ORDER", "OTHER", "OTTER",
    "OUTER", "OWNED", "OWNER",
    "PAGES", "PAINT", "PANDA", "PAPER", "PARTY", "PATCH", "PEACE", "PEACH",
    "PENNY", "PIANO", "PLACE", "PLAIN", "PLANT", "PLATE", "POLAR", "POPPY",
    "POWER", "PRESS", "PRICE", "PRIDE", "PRIZE", "PROUD", "PUPPY", "PURSE",
    "QUEEN", "QUICK", "QUIET",
    "RADIO", "RAINY", "RAISE", "REACH", "READY", "RIGHT", "RIVER", "ROAST",
    "ROBIN", "ROCKS", "ROCKY", "ROUND", "ROYAL", "RULER",
    "SADLY", "SALAD", "SALTY", "SANDY", "SAUCE", "SAVED", "SCARY", "SCOUT",
    "SEEDS", "SEVEN", "SHADE", "SHAPE", "SHARK", "SHARP", "SHEEP", "SHELF",
    "SHELL", "SHIFT", "SHINE", "SHIRT", "SHOES", "SHOOT", "SHORT", "SHOUT",
    "SHOWN", "SILLY", "SINCE", "SIXTY", "SLEEP", "SLICE", "SLIDE", "SLOPE",
    "SMALL", "SMART", "SMILE", "SMOKE", "SNACK", "SNAIL", "SNAKE", "SNOWY",
    "SOLID", "SOLVE", "SOUTH", "SPACE", "SPARK", "SPEED", "SPELL", "SPEND",
    "SPOON", "SPORT", "SPRAY", "SQUID", "STACK", "STAMP", "STAND", "STARE",
    "START", "STATE", "STAYS", "STEAL", "STEAM", "STICK", "STILL", "STONE",
    "STOOL", "STORK", "STORM", "STORY", "STOVE", "STUFF", "STYLE", "SUGAR",
    "SUNNY", "SUPER", "SWEET", "SWIFT", "SWIRL",
    "TABLE", "TAKEN", "TASTY", "THANK", "THICK", "THIRD", "THREE", "THREW",
    "THROW", "TIGER", "TITLE", "TOTAL", "TOUCH", "TOUGH", "TOWER", "TOWEL",
    "TRACK", "TRAIL", "TRAIN", "TREAT", "TRICK", "TRIED", "TROOP", "TRUST",
    "TRUTH", "TULIP", "TUMMY", "TWIST",
    "UNDER", "UNTIL", "UPPER", "UPSET",
    "VIDEO", "VISIT",
    "WATCH", "WATER", "WHALE", "WHEAT", "WHEEL", "WHERE", "WHICH", "WHILE",
    "WHITE", "WHOLE", "WINDS", "WOMAN", "WOMEN", "WORLD", "WORRY", "WORTH",
    "WRITE",
    "YEARS", "YOUNG", "YOUTH",
    "ZEBRA"
  ],

  3: [
    "AGENT", "ALERT", "ALIKE", "ALLEY", "ALLOW", "APART", "APPLY", "APRON",
    "ASKED", "ATLAS", "AVOID", "AWARD", "AWARE",
    "BADGE", "BANJO", "BANKS", "BASIC", "BATCH", "BEAST", "BEGAN", "BEGIN",
    "BEING", "BIBLE", "BLADE", "BLAND", "BLAST", "BLAZE", "BLEND", "BLESS",
    "BONUS", "BOOST", "BOOTH", "BOUND", "BOXER", "BREED", "BRISK", "BROOK",
    "BROTH", "BUSHY", "BUYER",
    "CAUSE", "CEDAR", "CHAIN", "CHARM", "CHART", "CHEAP", "CHESS",
    "CHIME", "CHIRP", "CLASS", "CLICK", "CLIFF", "CLING", "COAST", "COCOA",
    "COMET", "CORAL", "CREEK", "CRISP", "CRUST", "CURVE",
    "DEALT", "DENSE", "DEPTH", "DINER", "DISCO", "DITCH", "DODGE", "DOUGH",
    "DRAFT", "DRAIN", "DRAMA", "DRANK", "DRAWN", "DRIFT", "DROVE", "DRYER",
    "DUNES", "DUSTY", "DWARF",
    "ENTRY", "ESSAY", "EVENT", "EXIST",
    "FABLE", "FAITH", "FLICK", "FLORA", "FLOWN", "FLUID", "FOCUS",
    "FORGE", "FORMS", "FORTH", "FROWN", "FULLY", "FUNKY",
    "GLADE", "GLEAM", "GLOSS", "GRACE", "GRAIN", "GRANT", "GRASP", "GRIND",
    "GROAN", "GROOM", "GROSS", "GROVE", "GRUEL", "GUILD", "GUSTO",
    "HAVEN", "HEDGE", "HERBS", "HERON", "HIGHS", "HUSKY",
    "IDEAL", "INNER", "INPUT",
    "JEWEL", "JOKER", "JOUST",
    "KAYAK", "KNEEL", "KNELT",
    "LABEL", "LANCE", "LAYER", "LEAFY", "LIMIT", "LINER", "LIVER", "LOCAL",
    "LODGE", "LOGIC", "LOFTY", "LOVER", "LOYAL",
    "MAKER", "MAYOR", "MINDS", "MISTY", "MOURN", "MUSTY",
    "NIFTY", "NOBLE", "NOTED", "NOVEL",
    "OPERA", "ORBIT",
    "PACKS", "PANEL", "PANSY", "PEAKS", "PEPPY", "PERKY", "PLAID", "PLAZA",
    "PLUCK", "PLUME", "PROOF", "PRUNE",
    "QUEST", "QUIRK", "QUOTA",
    "RALLY", "REBEL", "REEDS", "REIGN", "RELAX", "REPAY", "REPLY", "RIDER",
    "RIDGE", "RISKY", "RIVAL", "ROMAN", "ROOMY", "ROOTS", "ROPES", "ROSES",
    "ROUGH", "RUSTY",
    "SCENE", "SEDAN", "SEIZE", "SENSE", "SHEER", "SHRUG", "SIGHT", "SIXTH",
    "SKILL", "SLACK", "SLEEK", "SLEET", "SPEAR", "SPICE", "SPIKE", "SPINE",
    "SPOKE", "SPOOK", "SPREE", "SPRIG", "STEEP", "STEER", "STERN", "STOCK",
    "STOMP", "STUDY", "SWAMP", "SWARM", "SWOOP",
    "TEARY", "TREND", "TUNER",
    "UNITY", "USHER",
    "VALID", "VALUE", "VAULT", "VIGOR", "VIRAL", "VITAL", "VIVID", "VOCAL",
    "WADED", "WANDS", "WEAVE", "WEDGE", "WITTY", "WOODY",
    "YACHT", "YEARN",
    "ZESTY", "ZONES", "ZONAL"
  ],

  4: [
    "ALTAR", "ANKLE", "ANNEX", "AVAIL",
    "BASIN", "BLEAT", "BOAST", "BRIDE", "BREAM", "BULGE",
    "CLAMP", "CLANG", "CLANK", "CLASH", "CLASP", "CUBIC",
    "DECOR", "DELTA", "DERBY", "DEVIL",
    "EMOTE", "EVADE", "EXCEL",
    "FLEET",
    "GROPE",
    "HUMID",
    "PLUMB", "PRIME",
    "RABBI", "RADAR", "REALM",
    "SOLAR", "STEEL", "STASH",
    "VAPOR", "VICAR",
    "MYRRH"
  ]
};

// Flat sorted array of all words (used throughout the app)
const WORDS = [...WORD_GRADES[2], ...WORD_GRADES[3], ...WORD_GRADES[4]].sort();

// Quick lookup: word → grade
const WORD_GRADE_MAP = {};
for (const [grade, words] of Object.entries(WORD_GRADES)) {
  for (const word of words) {
    WORD_GRADE_MAP[word] = Number(grade);
  }
}
