// src/ParticlesBackground.js
import React from "react";
import { Particles } from "react-tsparticles";

const ParticlesBackground = () => {
    return (
        <Particles
            options={{
                particles: {
                    number: {
                        value: 200,
                    },
                    color: {
                        value: "#FFFFFF",
                    },
                    shape: {
                        type: ["circle", "triangle", "square", "polygon"],
                    },
                    opacity: {
                        value: { min: 0.3, max: 1 },
                    },
                    size: {
                        value: { min: 2, max: 5 },
                    },
                    move: {
                        enable: true,
                        speed: 2,
                        direction: "none",
                        random: true,
                        straight: false,
                        outModes: {
                            default: "bounce",
                        },
                    },
                },
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "grab",
                        },
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        grab: {
                            distance: 150,
                            lineLinked: {
                                opacity: 0.5,
                            },
                        },
                    },
                },
                detectRetina: true,
            }}
        />
    );
};

export default ParticlesBackground;
