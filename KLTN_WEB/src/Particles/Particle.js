import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesComponent = (props) => {

    const [init, setInit] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
        console.log(container);
    };

    const options = useMemo(
        () => ({
            background: {
                color: {
                    value: "#0D1B2A",
                },
            },
            fpsLimit: 120,
            interactivity: {
                events: {
                    // onClick: {
                    //     enable: true,
                    //     mode: "push",
                    // },
                    // onHover: {
                    //     enable: true,
                    //     mode: 'grab',
                    // },
                },
                modes: {
                    push: {
                        quantity: 4,
                        distance: 200,
                        duration: 0.4,
                    },
                    grab: {
                        distance: 150,
                        lineLinked: {
                            opacity: 0.5,
                        },
                    },
                },
            },
            particles: {
                color: {
                    value: "#FFFFFF",
                },
                links: {
                    color: "#FFFFFF",
                    distance: 120,
                    enable: true,
                    opacity: 0.5,
                    width: 2,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "bounce",
                    },
                    random: true,
                    speed: 2,
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        value_area: 800,
                    },
                    value: 200,
                },
                opacity: {
                    value: { min: 0.3, max: 1 },
                },
                shape: {
                    type: ["circle", "triangle", "square", "polygon"], // Added shapes
                    options: {
                        polygon: {
                            sides: 5, // Number of sides for polygon shape
                        },
                    },
                },
                size: {
                    value: { min: 2, max: 5 },
                },
            },
            detectRetina: true,
        }

        ),
        [],
    );


    return <Particles id={props.id} init={particlesLoaded} options={options} />;
};

export default ParticlesComponent;

// import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { useEffect, useMemo, useState } from "react";
// import { loadSlim } from "@tsparticles/slim";

// const ParticlesComponent = (props) => {
//     const [init, setInit] = useState(false);

//     useEffect(() => {
//         initParticlesEngine(async (engine) => {
//             await loadSlim(engine);
//         }).then(() => {
//             setInit(true);
//         });
//     }, []);

//     const particlesLoaded = (container) => {
//         console.log(container);
//     };

//     const options = useMemo(
//         () => ({
//             background: {
//                 color: {
//                     value: "#1E2F97",
//                 },
//             },
//             fpsLimit: 120,
//             interactivity: {
//                 events: {
//                     onClick: {
//                         enable: true,
//                         mode: "push",
//                     },
//                     onHover: {
//                         enable: true,
//                         mode: 'repulse', // Thay đổi từ 'grab' sang 'repulse' để tạo hiệu ứng đẩy
//                     },
//                 },
//                 modes: {
//                     push: {
//                         quantity: 4,
//                         distance: 200,
//                         duration: 0.4,
//                     },
//                     repulse: { // Thêm hiệu ứng đẩy
//                         distance: 100,
//                         duration: 0.4,
//                     },
//                 },
//             },
//             particles: {
//                 color: {
//                     value: ["#FFFFFF", "#FF0000", "#00FF00", "#0000FF"], // Thêm nhiều màu sắc
//                 },
//                 links: {
//                     color: "#FFFFFF",
//                     distance: 150,
//                     enable: true,
//                     opacity: 0.5,
//                     width: 2,
//                 },
//                 move: {
//                     direction: "none",
//                     enable: true,
//                     outModes: {
//                         default: "bounce",
//                     },
//                     random: true,
//                     speed: 3, // Tăng tốc độ di chuyển
//                     straight: false,
//                 },
//                 number: {
//                     density: {
//                         enable: true,
//                         value_area: 800,
//                     },
//                     value: 300, // Tăng số lượng hạt
//                 },
//                 opacity: {
//                     value: { min: 0.3, max: 1 },
//                 },
//                 shape: {
//                     type: ["circle", "triangle", "square", "polygon"],
//                     options: {
//                         polygon: {
//                             sides: 5,
//                         },
//                     },
//                 },
//                 size: {
//                     value: { min: 3, max: 8 }, // Tăng kích thước hạt
//                 },
//             },
//             detectRetina: true,
//         }),
//         [],
//     );

//     return <Particles id={props.id} init={particlesLoaded} options={options} />;
// };

// export default ParticlesComponent;



// import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { useEffect, useMemo, useState } from "react";
// import { loadSlim } from "@tsparticles/slim";

// const ParticlesComponent = (props) => {
//     const [init, setInit] = useState(false);

//     useEffect(() => {
//         initParticlesEngine(async (engine) => {
//             await loadSlim(engine);
//         }).then(() => {
//             setInit(true);
//         });
//     }, []);

//     const particlesLoaded = (container) => {
//         console.log(container);
//     };

//     const options = useMemo(
//         () => ({
//             background: {
//                 color: {
//                     value: "#1E2F97",
//                 },
//             },
//             fpsLimit: 60,
//             interactivity: {
//                 events: {
//                     onClick: {
//                         enable: true,
//                         mode: "push",
//                     },
//                     onHover: {
//                         enable: true,
//                         mode: 'bubble', // Thay đổi thành 'bubble' để tạo hiệu ứng nổi
//                     },
//                 },
//                 modes: {
//                     push: {
//                         quantity: 4,
//                         distance: 200,
//                         duration: 0.4,
//                     },
//                     bubble: { // Thêm hiệu ứng nổi
//                         distance: 40,
//                         duration: 2,
//                         size: 40,
//                     },
//                 },
//             },
//             particles: {
//                 color: {
//                     value: ["#FFFFFF", "#FFCC00", "#FF6699", "#66CCFF"], // Thêm nhiều màu sắc khác
//                 },
//                 links: {
//                     color: "#FFFFFF",
//                     distance: 120,
//                     enable: true,
//                     opacity: 0.6,
//                     width: 2,
//                 },
//                 move: {
//                     direction: "none",
//                     enable: true,
//                     outModes: {
//                         default: "out", // Hạt sẽ ra ngoài mà không quay lại
//                     },
//                     random: true,
//                     speed: 4, // Tăng tốc độ di chuyển
//                     straight: false,
//                 },
//                 number: {
//                     density: {
//                         enable: true,
//                         value_area: 800,
//                     },
//                     value: 250, // Tăng số lượng hạt
//                 },
//                 opacity: {
//                     value: { min: 0.5, max: 1 },
//                 },
//                 shape: {
//                     type: ["circle", "edge", "triangle", "polygon"], // Thêm hình dạng mới
//                     options: {
//                         polygon: {
//                             sides: 6, // Số cạnh của hình đa giác
//                         },
//                     },
//                 },
//                 size: {
//                     value: { min: 5, max: 10 }, // Tăng kích thước hạt
//                 },
//             },
//             detectRetina: true,
//         }),
//         [],
//     );

//     return <Particles id={props.id} init={particlesLoaded} options={options} />;
// };

// export default ParticlesComponent;

// import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { useEffect, useMemo, useState } from "react";
// import { loadSlim } from "@tsparticles/slim";

// const ParticlesComponent = (props) => {
//     const [init, setInit] = useState(false);

//     useEffect(() => {
//         initParticlesEngine(async (engine) => {
//             await loadSlim(engine);
//         }).then(() => {
//             setInit(true);
//         });
//     }, []);

//     const particlesLoaded = (container) => {
//         console.log(container);
//     };

//     const options = useMemo(
//         () => ({
//             background: {
//                 color: {
//                     value: "#0D1B2A", // Màu nền tối để phù hợp với chủ đề IoT
//                 },
//             },
//             fpsLimit: 60,
//             interactivity: {
//                 events: {
//                     onClick: {
//                         enable: true,
//                         mode: "push",
//                     },
//                     onHover: {
//                         enable: true,
//                         mode: 'bubble',
//                     },
//                 },
//                 modes: {
//                     push: {
//                         quantity: 4,
//                         distance: 200,
//                         duration: 0.4,
//                     },
//                     bubble: {
//                         distance: 40,
//                         duration: 2,
//                         size: 40,
//                     },
//                 },
//             },
//             particles: {
//                 color: {
//                     value: ["#00BFFF", "#00FF7F", "#FFD700", "#FF4500"], // Màu sắc tươi sáng và hiện đại
//                 },
//                 links: {
//                     color: "#00BFFF",
//                     distance: 150,
//                     enable: true,
//                     opacity: 0.5,
//                     width: 2,
//                 },
//                 move: {
//                     direction: "none",
//                     enable: true,
//                     outModes: {
//                         default: "out",
//                     },
//                     random: true,
//                     speed: 3,
//                     straight: false,
//                 },
//                 number: {
//                     density: {
//                         enable: true,
//                         value_area: 800,
//                     },
//                     value: 300,
//                 },
//                 opacity: {
//                     value: { min: 0.3, max: 0.8 },
//                 },
//                 shape: {
//                     type: ["circle", "edge", "triangle", "polygon"],
//                     options: {
//                         polygon: {
//                             sides: 6,
//                         },
//                     },
//                 },
//                 size: {
//                     value: { min: 5, max: 10 },
//                 },
//             },
//             detectRetina: true,
//         }),
//         [],
//     );

//     return <Particles id={props.id} init={particlesLoaded} options={options} />;
// };

// export default ParticlesComponent;


// import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { useEffect, useMemo, useState } from "react";
// import { loadSlim } from "@tsparticles/slim";

// const ParticlesComponent = (props) => {
//     const [init, setInit] = useState(false);

//     useEffect(() => {
//         initParticlesEngine(async (engine) => {
//             await loadSlim(engine);
//         }).then(() => {
//             setInit(true);
//         });
//     }, []);

//     const particlesLoaded = (container) => {
//         console.log(container);
//     };

//     const options = useMemo(
//         () => ({
//             background: {
//                 color: {
//                     value: "#0D1B2A", // Màu nền tối
//                 },
//             },
//             fpsLimit: 60,
//             interactivity: {
//                 events: {
//                     onClick: {
//                         enable: true,
//                         mode: "push",
//                     },
//                     onHover: {
//                         enable: true,
//                         mode: 'bubble',
//                     },
//                 },
//                 modes: {
//                     push: {
//                         quantity: 4,
//                         distance: 200,
//                         duration: 0.4,
//                     },
//                     bubble: {
//                         distance: 40,
//                         duration: 2,
//                         size: 40,
//                     },
//                 },
//             },
//             particles: {
//                 color: {
//                     value: ["#00BFFF", "#FF4500"], // Màu sắc liên quan đến nhiệt độ
//                 },
//                 links: {
//                     color: "#00BFFF",
//                     distance: 150,
//                     enable: true,
//                     opacity: 0.5,
//                     width: 2,
//                 },
//                 move: {
//                     direction: "none",
//                     enable: true,
//                     outModes: {
//                         default: "out",
//                     },
//                     random: true,
//                     speed: 3,
//                     straight: false,
//                 },
//                 number: {
//                     density: {
//                         enable: true,
//                         value_area: 800,
//                     },
//                     value: 300,
//                 },
//                 opacity: {
//                     value: { min: 1, max: 0.8 },
//                 },
//                 shape: {
//                     type: ["circle", "triangle", "image"], // Thêm hình ảnh biểu tượng IoT
//                     options: {
//                         image: {
//                             src: "https://cdn.flowerstore.vn/wp-content/uploads/2024/07/hinh-anh-cu-shin-1.jpg", // Hình ảnh biểu tượng nhiệt độ
//                             width: 40,
//                             height: 40,
//                         },
//                         polygon: {
//                             sides: 6,
//                         },
//                     },
//                 },
//                 size: {
//                     value: { min: 5, max: 10 },
//                 },
//             },
//             detectRetina: true,
//         }),
//         [],
//     );

//     return <Particles id={props.id} init={particlesLoaded} options={options} />;
// };

// export default ParticlesComponent;

// import Particles, { initParticlesEngine } from "@tsparticles/react";
// import { useEffect, useMemo, useState } from "react";
// import { loadSlim } from "@tsparticles/slim";

// const ParticlesComponent = (props) => {
//     const [init, setInit] = useState(false);

//     useEffect(() => {
//         initParticlesEngine(async (engine) => {
//             await loadSlim(engine);
//         }).then(() => {
//             setInit(true);
//         });
//     }, []);

//     const particlesLoaded = (container) => {
//         console.log(container);
//     };

//     const options = useMemo(
//         () => ({
//             background: {
//                 color: {
//                     value: "#0D1B2A", // Màu nền tối
//                 },
//             },
//             fpsLimit: 60,
//             interactivity: {
//                 events: {
//                     onClick: {
//                         enable: true,
//                         mode: "push",
//                     },
//                     onHover: {
//                         enable: true,
//                         mode: 'bubble',
//                     },
//                 },
//                 modes: {
//                     push: {
//                         quantity: 4,
//                         distance: 200,
//                         duration: 5,
//                     },
//                     bubble: {
//                         distance: 40,
//                         duration: 2,
//                         size: 40,
//                     },
//                 },
//             },
//             particles: {
//                 color: {
//                     value: ["#00BFFF", "#FF6347"], // Màu sắc liên quan đến nhiệt độ và công nghệ
//                 },
//                 links: {
//                     color: "#00BFFF",
//                     distance: 150,
//                     enable: true,
//                     opacity: 0.5,
//                     width: 1,
//                 },
//                 move: {
//                     direction: "none",
//                     enable: true,
//                     outModes: {
//                         default: "out",
//                     },
//                     random: true,
//                     speed: 3,
//                     straight: false,
//                 },
//                 number: {
//                     density: {
//                         enable: true,
//                         value_area: 500, // Giảm giá trị để tăng mật độ hạt
//                     },
//                     value: 400,
//                 },
//                 opacity: {
//                     value: { min: 0.5, max: 1 },
//                 },
//                 shape: {
//                     type: ["circle", "image", "triangle"], // Thêm hình ảnh biểu tượng IoT và các hình khác
//                     options: {
//                         image: [
//                             {
//                                 src: "https://cdn-icons-png.freepik.com/512/6702/6702322.png", // Biểu tượng IoT
//                                 width: 20,
//                                 height: 20,
//                             },
//                             {
//                                 src: "https://cdn-icons-png.flaticon.com/512/6080/6080697.png", // Biểu tượng nhiệt độ
//                                 width: 20,
//                                 height: 20,
//                             },

//                             {
//                                 src: "https://cdn2.iconfinder.com/data/icons/internet-of-things-26/64/smartphone-wifi-iot-internet-things-512.png", // Biểu tượng mạng lưới (Network)
//                                 width: 20,
//                                 height: 20,
//                             },
//                             {
//                                 src: "https://cdn-icons-png.freepik.com/512/5003/5003741.png", // Biểu tượng cảm biến
//                                 width: 20,
//                                 height: 20,
//                             },

//                         ],
//                     },
//                 },

//                 size: {
//                     value: { min: 15, max: 15 }, // Điều chỉnh kích thước hạt
//                 },
//             },
//             detectRetina: true,
//         }),
//         [],
//     );

//     return <Particles id={props.id} init={particlesLoaded} options={options} />;
// };

// export default ParticlesComponent;

