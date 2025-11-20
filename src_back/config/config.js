const mysql = require('mysql2/promise');

// 1. connection 객체를 외부에 선언 (풀링 연결이 아닌 단일 연결 사용 가정)
let dbConnection = null;

/**
 * 데이터베이스 연결을 시도하고 성공 시 연결 객체를 설정합니다.
 * 연결이 이미 존재하면 기존 연결을 반환합니다.
 * @returns {mysql.Connection} 연결 객체
 */
const connectDB = async () => {
    if (dbConnection) {
        console.log('✅ MySQL 연결이 이미 존재합니다. 기존 연결을 사용합니다.');
        return dbConnection;
    }

    try {
        // MySQL 연결 설정 (환경 변수 사용을 위해 하드코딩된 비밀번호는 임시로 사용)
        dbConnection = await mysql.createConnection({
            host: `${process.env.DB_HOST}`,
            user: `${process.env.DB_USER}`,
            password: `${process.env.DB_PASS}`, // 실제 환경에서는 .env 파일을 사용해야 합니다.
            database: `${process.env.DB_NAME}`
        });
        console.log('config.js: ✅ MySQL에 성공적으로 연결되었습니다.');
        return dbConnection;
    } catch (err) {
        console.error('config.js: ❌ MySQL 연결 실패:', err.stack);
        // 연결 실패 시 호출 스택을 유지하기 위해 에러를 다시 던집니다.
        throw new Error(`config.js: DB 연결 실패: ${err.message}`);
    }
};

/**
 * 활성화된 DB 연결 객체를 반환합니다. 라우터나 컨트롤러에서 쿼리 실행 시 사용됩니다.
 * @returns {mysql.Connection} 연결 객체
 */
const getConnection = async () => {
    if (!dbConnection) {
        await connectDB();
        return dbConnection;
        // throw new Error('config.js: 데이터베이스 연결이 초기화되지 않았습니다. connectDB()를 먼저 호출하세요.');
    }
    return dbConnection;
};

/**
 * DB 연결을 종료합니다. 서버 종료 시에만 호출해야 합니다.
 */
const closeConnection = async () => {
    if (dbConnection) {
        try {
            await dbConnection.end();
            dbConnection = null; // 연결 객체 초기화
            console.log('config.js: MySQL 연결이 성공적으로 종료되었습니다.');
        } catch (err) {
            console.error('config.js: 연결 종료 중 오류가 발생했습니다:', err.stack);
        }
    }
};

module.exports = {
    connectDB,
    getConnection,
    closeConnection
};