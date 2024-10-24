import envs from './configs/envs.js';
import app from './app.js';

const PORT = envs.port || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});