import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 10 },
        { duration: '20s', target: 20 },
        { duration: '10s', target: 0 },
    ],
    thresholds: {
        http_req_duration: ['p(95)<500'],
        http_req_failed:   ['rate<0.01'],
    },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

export default function () {
    const services = http.get(`${BASE_URL}/api/services`);
    check(services, {
        'services: status 200': (r) => r.status === 200,
        'services: réponse < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(0.5);

    const login = http.post(
        `${BASE_URL}/api/login`,
        JSON.stringify({ email: 'admin@babiservices.ci', mot_de_passe: 'password' }),
        { headers: { 'Content-Type': 'application/json' } }
    );
    check(login, {
        'login: status 200': (r) => r.status === 200,
        'login: token présent': (r) => JSON.parse(r.body).token !== undefined,
        'login: réponse < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}
