/**
 * Commitlint 설정 파일
 * 
 * 이 설정은 fez-front-taap 프로젝트의 git log 분석을 바탕으로 만들어진 커스텀 규칙입니다.
 * 
 * 📋 커밋 메시지 형식:
 *   - [타입]: [설명] [MVDV-번호]
 *   - [타입]: [설명] ([MVDV-번호])
 * 
 * 🏷️  허용되는 타입:
 *   영문: fix, add, feat, docs, style, refactor, perf, test, build, ci, chore
 *   한국어: 개발, 변경, 수정, 반영, 추가, 삭제, 개선
 * 
 * ✅ 올바른 예시:
 *   - fix: 버튼 클릭 이슈 수정 MVDV-1234
 *   - 변경: 레이아웃 디자인 변경(MVDV-5678)
 *   - add: 새로운 컴포넌트 추가 MVDV-9999
 * 
 * ❌ 잘못된 예시:
 *   - 버그 수정 (타입 누락)
 *   - fix: 수정 (설명 너무 짧음, MVDV 번호 누락)
 *   - bugfix: 이슈 해결 MVDV-1234 (허용되지 않는 타입)
 * 
 * 🚫 예외 사항:
 *   - Merge 커밋과 Revert 커밋은 검증에서 제외됩니다.
 * 
 * 📏 길이 제한:
 *   - 설명 최소 길이: 5자
 *   - 설명 최대 길이: 100자
 *   - 헤더 전체 최대 길이: 120자
 */
module.exports = {
  extends: [],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\S+?):\s(.+)$/,
      headerCorrespondence: ['type', 'subject']
    }
  },
  rules: {
    // 커스텀 규칙: fez-front-taap 프로젝트 패턴 기반
    'type-enum': [2, 'always', [
      // 영문 타입
      'fix', 'add', 'feat', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore',
      // 한국어 타입 (fez-front-taap 프로젝트에서 사용)
      '개발', '변경', '수정', '반영', '추가', '삭제', '개선'
    ]],
    'type-case': [0], // 케이스 검사 비활성화 (한국어 지원)
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-min-length': [2, 'always', 5],
    'subject-max-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 120],
    
    // 커스텀: MVDV 티켓 번호 형식 검증
    'mvdv-ticket-format': [2, 'always']
  },
  plugins: [
    {
      rules: {
        'mvdv-ticket-format': (parsed) => {
          const { subject } = parsed;
          
          // Merge, Revert 커밋은 예외
          if (parsed.type === 'Merge' || parsed.type === 'Revert') {
            return [true];
          }
          
          // MVDV-숫자 패턴 검사 (괄호 포함 또는 공백 후)
          const mvdvPattern = /(\(MVDV-\d+\)|MVDV-\d+)$/;
          
          if (!mvdvPattern.test(subject)) {
            return [false, '커밋 메시지는 MVDV-번호로 끝나야 합니다. 예: "fix: 버그 수정 MVDV-1234" 또는 "변경: 기능 변경(MVDV-1234)"'];
          }
          
          return [true];
        },
        
      }
    }
  ]
};
