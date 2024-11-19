module.exports = {
  apps: [
    {
      name: 'doby-admin',      // 애플리케이션 이름
      port: '3000',            // 포트 번호
      exec_mode: 'cluster',    // 실행 모드
      instances: 2,            // 원하는 인스턴스 수로 수정 (예: 2개)
      script: '.output/server/index.mjs',  // 실행할 스크립트
      env: {
        NODE_ENV: 'production',
        NUXT_APP_BASE_URL: '/',  // 베이스 URL
        NITRO_HOST: '0.0.0.0',   // 호스트
        NITRO_PORT: 3000,        // 포트
        DB_HOST: 'forgurm.iptime.org',
        DB_USER: 'forgurm',
        DB_PASSWORD: 'asdfqwer1!',
        DB_NAME: 'tpsl',
        DB_PORT: '3306',
        DB_FONT: 'utf8mb4'
      },
    },
  ],
} 