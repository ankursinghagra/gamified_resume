export const WORLD_WIDTH = 2400;
export const WORLD_HEIGHT = 1840;

export const turning_rects = {
    NW: { x: 230, y: 240, h: 100, w: 150 },
    NE: { x: 1860, y: 240, h: 240, w: 250 },
    SW: { x: 1900, y: 1100, h: 180, w: 220 },
    SE: { x: 230, y: 1160, h: 130, w: 150 },
};

// Simple collision boxes for obstacles
// {x, y, w, h}
export const COLLIDERS = [
    // Water Boundaries (approximate based on map visual)
    { x: 0, y: 0, w: 2400, h: 230 }, // Top water
    { x: 0, y: 1240, w: 2400, h: 600 }, // Bottom water
    { x: 0, y: 0, w: 230, h: 1840 }, // Left water
    { x: 2070, y: 0, w: 400, h: 1840 }, // Right water
    
    // Trees (Approximate positions from commented out code in original file)
    { x: 350, y: 300, w: 30, h: 30 },
    { x: 450, y: 300, w: 30, h: 30 },
    { x: 550, y: 300, w: 30, h: 30 },
    { x: 400, y: 400, w: 30, h: 30 },
    { x: 500, y: 400, w: 30, h: 30 },
    
    // Building areas (prevent walking inside the graphic, usually just the base)
    // Village Hall (NE) Base
    { x: 1900, y: 300, w: 150, h: 100 },
    // Workshop (SW) Base
    { x: 1950, y: 1200, w: 100, h: 80 },
];

export const ZONE_CONTENT = {
    NE: {
        title: "About Me",
        content: `
            <p>Hello! I am Ankur Singh Agra.</p>
            <p>I am a passionate developer who loves building gamified experiences.</p>
            <br>
            <p>My journey started with simple scripts and evolved into full-stack development.</p>
        `
    },
    NW: {
        title: "Skills",
        content: `
            <div class="lists">
                <ul class="nes-list is-disc">
                    <li>JavaScript / TypeScript</li>
                    <li>React / Next.js</li>
                    <li>Pixi.js / Canvas API</li>
                    <li>Node.js / Express</li>
                    <li>Python / Django</li>
                </ul>
            </div>
        `
    },
    SE: {
        title: "Contact",
        content: `
            <p>Find me on:</p>
            <div style="display: flex; gap: 10px; margin-top: 10px;">
                <a href="#" class="nes-btn is-primary"><i class="nes-icon github"></i> GitHub</a>
                <a href="#" class="nes-btn is-primary"><i class="nes-icon linkedin"></i> LinkedIn</a>
            </div>
            <p style="margin-top: 20px;">Or send me an email!</p>
        `
    },
    SW: {
        title: "Projects",
        content: `
            <p>Here are some of my cool projects:</p>
            <section class="nes-container with-title is-centered">
                <p class="title">Gamified Resume</p>
                <p>This very website! Built with Pixi.js.</p>
            </section>
            <br>
            <section class="nes-container with-title is-centered">
                <p class="title">Interview Tracker</p>
                <p>A full-stack app to track job applications.</p>
            </section>
        `
    }
};
