export const generateMockChartData = (hospital) => {
    const today = new Date();
    const data = [];

    // Create a stable seed based on hospital ID or name
    const seedStr = hospital ? (hospital.id || hospital.name).toString() : "aggregate";
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
        seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
        seed |= 0;
    }

    const seededRandom = (s) => {
        const x = Math.sin(s) * 10000;
        return x - Math.floor(x);
    };

    // Base stats for scaling
    const baseBeds = hospital ? (parseInt(hospital.beds) || 100) : 5000;
    const baseDoctors = hospital ? (parseInt(hospital.doctors || hospital.doctorsCount) || 10) : 1500;

    for (let i = 13; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');

        // Dynamic scaling with stable seeded randomness
        const currentSeed = seed + i;
        const admissions = Math.floor(Math.abs(seededRandom(currentSeed)) * (baseBeds * 0.1)) + Math.floor(baseBeds * 0.05);
        const discharges = Math.floor(Math.abs(seededRandom(currentSeed + 1)) * (baseBeds * 0.08)) + Math.floor(baseBeds * 0.04);
        const surgeries = Math.floor(Math.abs(seededRandom(currentSeed + 2)) * (baseDoctors * 0.2)) + Math.floor(baseDoctors * 0.05);
        const emergencies = Math.floor(Math.abs(seededRandom(currentSeed + 3)) * (baseBeds * 0.05)) + Math.floor(baseBeds * 0.02);

        data.push({
            date: dateStr,
            admissions: Math.max(1, admissions),
            discharges: Math.max(1, discharges),
            surgeries: Math.max(1, surgeries),
            emergencies: Math.max(1, emergencies)
        });
    }
    return data;
};

export const getSpecializationData = (hospitals, selectedHospital) => {
    if (selectedHospital) {
        const specs = selectedHospital.specializations || [];
        if (specs.length === 0) {
            return [{ name: 'None', value: 0 }];
        }

        return specs.map((spec, idx) => ({
            name: spec,
            value: 20 + (spec.length * 2) + (idx * 5) // Stable visual weights
        }));
    }

    const counts = {};
    hospitals.forEach(h => {
        (h.specializations || []).forEach(spec => {
            counts[spec] = (counts[spec] || 0) + 1;
        });
    });

    const result = Object.keys(counts).map(key => ({
        name: key,
        value: counts[key]
    }));

    return result.length > 0 ? result : [{ name: 'None', value: 0 }];
};

export const getAggregatedStats = (hospitals) => {
    const parseSafe = (val) => {
        if (!val) return 0;
        if (typeof val === 'string') return parseInt(val.replace(/,/g, '')) || 0;
        return val;
    };

    return {
        beds: hospitals.reduce((acc, h) => acc + parseSafe(h.beds), 0),
        doctors: hospitals.reduce((acc, h) => acc + parseSafe(h.doctors || h.doctorsCount), 0),
        patients: hospitals.reduce((acc, h) => acc + parseSafe(h.patients), 0).toLocaleString(),
        rating: (hospitals.reduce((acc, h) => acc + (parseFloat(h.rating) || 0), 0) / hospitals.length).toFixed(1)
    };
};
