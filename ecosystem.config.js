module.exports = {
  apps: [
    {
      name: 'doby-admin',      // 애플리케이션 이름
      port: '3000',            // 포트 번호
      exec_mode: 'cluster',    // 실행 모드
      instances: 'max',        // CPU 코어 수만큼 인스턴스 생성
      script: '.output/server/index.mjs',  // 실행할 스크립트
      env: {
        NODE_ENV: 'production',
        NUXT_APP_BASE_URL: '/',  // 베이스 URL
        NITRO_HOST: '0.0.0.0',   // 호스트
        NITRO_PORT: 3000,        // 포트
      },
    },
  ],
} 