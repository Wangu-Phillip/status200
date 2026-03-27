console.log('Environment keys:', Object.keys(process.env).filter(k => k.includes('DATA') || k.includes('POSTGRES')));
