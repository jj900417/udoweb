/*
 * 고객지원 — 문의·건의·오류 신고 화면의 문안.
 *
 * 이 폼은 우도 나우 앱 서버의 건의사항 창구(/v1/feedback)로 그대로 들어간다.
 * 그래서 **유형 5종과 라벨은 앱 화면(app_localizations_*.dart 의 feedbackCat*)과
 * 글자까지 같게 맞춘다** — 같은 받은편지함에 앱 문의와 웹 문의가 섞여 들어오는데
 * 유형 이름이 화면마다 다르면 운영자가 같은 것을 다른 것으로 읽는다.
 *
 * 유형 값(feature·bug·info_fix·inquiry·other)은 서버가 고정 프리셋으로 검증한다.
 * 여기서 값을 바꾸면 서버가 400 으로 거부한다 — 늘리려면 앱 서버부터 고칠 것.
 *
 * ⚠ 개인정보 보유기간·처리 상세를 여기에 적지 않는다. 방침의 단일 소스는 앱 서버의
 *   /privacy 문서다(불변식 #8 — 확인 안 된 사실을 쓰지 않는다).
 */
export const support = {
  title: '고객지원',
  subtitle: '불편한 점이나 잘못된 정보를 알려주세요',
  intro:
    '우도 나우를 쓰다가 생긴 문제, 잘못된 정보, 이렇게 되면 좋겠다 싶은 것을 남겨 주세요. ' +
    '확인해서 서비스에 반영할게요.',

  categoryLabel: '문의 유형',
  categories: [
    { value: 'feature', label: '기능 제안' },
    { value: 'bug', label: '오류 신고' },
    { value: 'info_fix', label: '정보 수정 요청' },
    { value: 'inquiry', label: '서비스 문의' },
    { value: 'other', label: '기타' },
  ],

  titleLabel: '제목',
  titlePlaceholder: '어떤 일인지 한 줄로 적어 주세요',
  messageLabel: '문의 내용',
  messagePlaceholder: '언제, 어느 화면에서, 무엇이 어떻게 됐는지 적어 주시면 빨리 찾을 수 있어요',
  /* {n} 은 남은 글자 수로 바뀐다. */
  remaining: '{n}자 더 쓸 수 있어요',

  emailLabel: '답변 받을 이메일 (선택)',
  emailHint: '답변이 필요하면 이메일을 남겨 주세요. 없어도 접수는 돼요.',

  envTitle: '사용 환경 추가하기',
  envHint: '오류 신고라면 적어 주시면 원인을 찾는 데 도움이 돼요. 선택이에요.',
  platformLabel: '플랫폼',
  platforms: [
    { value: '', label: '선택 안 함' },
    { value: 'ios', label: 'iOS' },
    { value: 'android', label: 'Android' },
    { value: 'web', label: '웹' },
    { value: 'other', label: '기타' },
  ],
  appVersionLabel: '앱 버전',
  appVersionPlaceholder: '1.0.0',
  osVersionLabel: 'OS 버전',
  osVersionPlaceholder: 'iOS 26.0',

  privacyTitle: '개인정보 처리 안내',
  privacyBody:
    '문의를 확인하고 답변하기 위해 입력하신 내용과 이메일 주소를 받아요. ' +
    '그 밖의 목적으로는 쓰지 않아요.',
  privacyLink: '개인정보처리방침 보기',
  consentLabel: '개인정보 수집 및 이용에 동의해요 (필수)',

  submit: '문의 보내기',
  submitting: '보내는 중…',

  doneTitle: '문의가 접수됐어요',
  doneBody: '보내주신 내용은 문의 확인과 서비스 개선에 써요.',
  doneEmail: '답변이 필요한 문의는 확인 후 남겨주신 이메일로 안내드릴게요.',
  doneAgain: '문의 하나 더 보내기',

  errors: {
    category: '문의 유형을 골라 주세요.',
    title: '제목을 입력해 주세요.',
    message: '문의 내용을 입력해 주세요.',
    email: '이메일 형식이 올바르지 않아요.',
    consent: '개인정보 수집 및 이용에 동의해 주세요.',
    invalid: '입력한 내용을 다시 확인해 주세요.',
    tooMany: '문의가 너무 잦아요. 잠시 후 다시 시도해 주세요.',
    network: '문의를 보내는 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.',
  },

  altTitle: '메일로도 보낼 수 있어요',
  altBody: '폼이 잘 안 되면 아래 주소로 바로 보내 주세요.',
  /* 앱 소개로 돌아가는 링크. 라벨을 두 조각으로 조립하지 않는다 — 언어마다 어순이 달라
     'Udo Now More' 같은 문장이 된다. */
  appLink: '우도 나우 앱 소개 보기',
} as const;
