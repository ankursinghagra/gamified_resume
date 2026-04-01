export const WORLD_WIDTH = 2400;
export const WORLD_HEIGHT = 1840;

export const turning_rects = {
    NW: { x: 230, y: 230, h: 150, w: 200 },
    NE: { x: 1860, y: 230, h: 150, w: 200 },
    SW: { x: 1900, y: 1110, h: 150, w: 200 },
    SE: { x: 230, y: 1110, h: 150, w: 200 },
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
    // { x: 350, y: 300, w: 30, h: 30 },
    // { x: 450, y: 300, w: 30, h: 30 },
    // { x: 550, y: 300, w: 30, h: 30 },
    // { x: 400, y: 400, w: 30, h: 30 },
    // { x: 500, y: 400, w: 30, h: 30 },

    // NW
    { x: 230, y: 230, w: 150, h: 100 },
    
    // Building areas (prevent walking inside the graphic, usually just the base)
    // Village Hall (NE) Base
    { x: 1920, y: 230, w: 150, h: 100 },
    // Workshop (SW) Base
    { x: 1950, y: 1200, w: 100, h: 80 },
];

export const ZONE_CONTENT = {
    NE: {
        title: "About Me",
        content: `
            <div class="nes-container is-dark with-title">
                <p class="title">Character Stats</p>
                <div style="display: flex; align-items: center; gap: 20px;">
                    <i class="nes-ash"></i>
                    <div>
                        <p><strong>Name:</strong> Ankur Singh Agra</p>
                        <p><strong>Class:</strong> Full Stack Developer</p>
                        <p><strong>Level:</strong> 99</p>
                    </div>
                </div>
                <br>
                <p>I build immersive web experiences. From pixel-perfect frontends to robust backends, I love turning code into creativity.</p>
            </div>
        `
    },
    NW: {
        title: "Skills",
        content: `
            <div style="display: flex; gap: 20px;">
                <div class="nes-container is-rounded" style="flex: 1;">
                    <p style="color: #e76e55;">Frontend</p>
                    <ul class="nes-list is-disc">
                        <li>JavaScript (ES6+)</li>
                        <li>React / Next.js</li>
                        <li>Pixi.js / Canvas</li>
                        <li>NES.css</li>
                    </ul>
                </div>
                <div class="nes-container is-rounded" style="flex: 1;">
                    <p style="color: #209cee;">Backend</p>
                    <ul class="nes-list is-circle">
                        <li>Node.js</li>
                        <li>Python / Django</li>
                        <li>SQL / NoSQL</li>
                        <li>REST APIs</li>
                    </ul>
                </div>
            </div>
        `
    },
    SE: {
        title: "Contact",
        content: `
            <p>Let's Connect!</p>
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <a href="https://github.com/ankursinghagra" target="_blank" class="nes-btn">
                    <i class="nes-icon github"></i> GitHub
                </a>
                <a href="https://linkedin.com/in/ankursinghagra" target="_blank" class="nes-btn is-primary">
                    <i class="nes-icon linkedin"></i> LinkedIn
                </a>
                <a href="mailto:contact@example.com" class="nes-btn is-success">
                    <i class="nes-icon gmail"></i> Email Me
                </a>
            </div>
        `
    },
    SW: {
        title: "Projects",
        content: `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <section class="nes-container with-title is-centered">
                    <p class="title">Gamified Resume</p>
                    <i class="nes-icon trophy is-large"></i>
                    <p>Interactive RPG portfolio built with Pixi.js.</p>
                </section>
                <section class="nes-container with-title is-centered">
                    <p class="title">Interview Tracker</p>
                    <i class="nes-icon coin is-large"></i>
                    <p>Full-stack dashboard for job applications.</p>
                </section>
            </div>
        `
    }
};
