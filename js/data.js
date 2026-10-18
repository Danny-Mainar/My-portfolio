const portfolioData = {
    projects:[
        {
            id: "zigbee-amr",
            title:"Zigbee AMR System",
            category:"Embedded System",
            badgeNum:"01",
            description: "Designed and simulated an IEEE 802.15.4 energy metering network using MATLAB/Simulink and EasyEDA with AODV mesh routing.",
            techStack: ["MATLAB", "EasyEDA", "Zigbee"],
            link:"projects/template.html?id=zigbee-amr",

            fullTitle: "Zigbee-Based Automatic Meter Reading (AMR) System",
            fullCategory: "Embedded System & Telecommunications",
            metaDomain: "Domain: RF Communication & IoT",
            metaTools: "Tools: MATLAB/Simulink, EasyEDA, Zigbee",
            overview: "This project evalautes the perfomance, packet delivery ratio, and latency of an IEEE 802.15.4 Zigbee mesh network designed for Automated Meter Reading (AMR) in dense urban residential blocks. The architecture models smart utility nodes communicating via multi-hop routing toward a central aggregator gateway.",
            specs: [
                {title: "Protocol Standard", desc: "IEEE 802.15.4 Physical and MAC layers operating in the 2.4GHz ISM band"},
                {title: "Routing Mechanism", desc: "Ad-hoc On-Demand Distance Vector (AODV) routing protocol optimized for minimal energy overhead"},
                {title: "Simulation Framework", desc: "MATLAB and Simulink communications toolbox used for channel loss modeling and packet collision analysis."}
            ],
            section1Header: "Key Engineering Challenges Solved",
            section1Text: "Deploying wireless sensor nodes in concrete-heavy multi-dwelling units introduces severe multipath fading and signal attenuation. To counter this, the simulation tested dynamic transmission power scaling and alternate node routing paths.<br><br>Using EasyEDA, companion transceiver circuit layouts were drafted keeping trace length minimization and ground-plane isolation in mind to reduce electromagnetic interference (EMI) at high switching frequencies. ",
            hasCode: false,
            codeSnippet: "",
            section2Header: "Simulation Results & perfomance Metrics",
            section2Text: "The MATLAB model successfully demonstrated stable mesh formation with up to 50 active nodes per coordinator. Packet drop rates remained under 2.4% even under heavy background noise simulation models, confirming high reliability for mission-critical utility data collection."
        },
        {
            id: "kalman-filter-mql",
            title: "Kalman Filter MQL% EA",
            category: "Quantative Dev",
            badgeNum: "02",
            description: "Built and backtested hybrid trading models combining 1D Kalman Filters and Markov Chain state transitions for automated execution.",
            techStack: ["Python", "MQL5", "MetaTrader 5"],
            link: "projects/template.html?id=kalman-mql5",

            fullTitle: "Kalman FIlter & Markov Chain MQL% EA",
            fullCategory: "Quantitative Development & Algorithmic Trading",
            metaDomain: "Instruments: USD/JPY, XAU/USD",
            metaTools: "Stack: MQL5, Pyhton, MetaTrader 5",
            overview: "Financial price series are inherently noisy and non-stationary. Standard moving average introduce lagging distortions when tracking fast regime changes. This hybrid Expert Advisor utilizes a one-dimensional <strong>Kalman Filter</strong> to extract smooth state estimates from noisy tick and bar data in real time, pairing it with a <strong>Markov Chain Transition Matrix</strong> to estimate probabilities for regime persistence.",
            specs:[
                {title: "Kalman Measurement Update", desc: " Continuously updates state estimates by calculating optimal Kalman Gain "},
                {title: "Markov State Regimes", desc: "Classifiesmarket state dynamics into discrete regimes (Trending Up, Ranging, Trending Down) using historical state transition probability matrices."},
                {title: "Execution & Risk Engine", desc: "Features dynamic lot sizing based on account equity percentage alongside automated stop-loss trailing driven by state volatility."}

            ],
            section1Header: "State Estimation Implimentation",
            section1Text: "The recursuve filtering process runs onevery incoming tick inside the MetaTrader 5 engine, calculating smoothed values without the phase lag associated with traditional FIR or IIR digital filters:",
            hasCode: true,
            codeSnippet:`// Recursive 1D Kalman Filter Update in MQL5
double UpdateKalman(double measurement) {
    // Prediction Update
    p_est = p_last + q_variance;

    // Measurement Update
    kalman_gain = p_est / (p_est + r_variance);
    current_est = last_est + kalman_gain * (measurement - last_est);
    p_est = (1.0 - kalman_gain) * p_est;

    // Save state for next iteration
    last_est = current_est;
    p_last = p_est;

    return current_est;
}`,
            section2Header: "Backtesting & Verification",
            section2Text: "The EA was modeled and optimized using Python (Numpy, Pandas, SciPy) to determine initial parameters before being compiled in MQL5 for tick-level backtesting across multi-year historical data on MetaTrader 5.The combined filter significantly reduced whipsaw false triggers during high-volatility news events."
            
        }
    ],
    articles:[
        {
            title: "Optimizing Embedded Communication Networks",
            source: "Medium",
            description: " A deep dive into wireless protocols and mesh routing efficiency for industrial energy metering systems.",
            link: "https://medium.com"
        },
        {
            title: "integrating ONNX MOdels into MetaTrader 5",
            source: "Dev.to",
            description: "Exporting gradient-boosting Machine learning models from python for real-time trade signal filtering.",
            link: "https://dev.to"
        }
    ]
};