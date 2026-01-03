import { PrismaClient, Level, ExerciseType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.exercise.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.vocabulary.deleteMany();
  await prisma.topic.deleteMany();

  // =====================================================
  // WEEK 1: EMAIL COMMUNICATION
  // =====================================================
  
  const emailTopic = await prisma.topic.create({
    data: {
      name: 'Email Communication',
      nameVi: 'Giao Tiếp Email',
      description: 'Learn vocabulary for writing professional emails',
      icon: '📧',
      order: 1,
    },
  });

  // Day 1: Opening & Closing
  await createWord({
    word: 'regarding',
    meaning: 'concerning; about',
    meaningVi: 'về vấn đề, liên quan đến',
    example: "I'm writing regarding the project deadline.",
    exampleVi: 'Tôi viết email về vấn đề thời hạn dự án.',
    phonetic: '/rɪˈɡɑːrdɪŋ/',
    topicId: emailTopic.id,
    order: 1,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: "I'm writing _____ the project deadline.",
        questionVi: 'Tôi viết email _____ thời hạn dự án.',
        options: ['regarding', 'about', 'for', 'with'],
        correctAnswer: 'regarding',
        explanation: '"Regarding" is more formal and commonly used in business emails.',
      },
      {
        type: ExerciseType.FILL_BLANK,
        question: 'Please contact me _____ any questions.',
        questionVi: 'Vui lòng liên hệ tôi _____ bất kỳ câu hỏi nào.',
        options: [],
        correctAnswer: 'regarding',
      },
    ],
  });

  await createWord({
    word: 'attached',
    meaning: 'joined or fastened to something',
    meaningVi: 'đính kèm',
    example: 'Please find the document attached.',
    exampleVi: 'Vui lòng xem tài liệu đính kèm.',
    phonetic: '/əˈtætʃt/',
    topicId: emailTopic.id,
    order: 2,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Please find the report _____.',
        questionVi: 'Vui lòng xem báo cáo _____.',
        options: ['attached', 'attaching', 'attach', 'attachment'],
        correctAnswer: 'attached',
        explanation: 'Use "attached" as past participle after "find".',
      },
    ],
  });

  await createWord({
    word: 'kindly',
    meaning: 'in a kind manner; please (polite)',
    meaningVi: 'vui lòng (lịch sự)',
    example: 'Could you kindly review this report?',
    exampleVi: 'Bạn có thể vui lòng xem xét báo cáo này không?',
    phonetic: '/ˈkaɪndli/',
    topicId: emailTopic.id,
    order: 3,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Could you _____ send me the file?',
        questionVi: 'Bạn có thể _____ gửi cho tôi file không?',
        options: ['kindly', 'kind', 'kindness', 'kinder'],
        correctAnswer: 'kindly',
      },
    ],
  });

  await createWord({
    word: 'promptly',
    meaning: 'without delay; quickly',
    meaningVi: 'nhanh chóng, kịp thời',
    example: 'Please respond promptly to this request.',
    exampleVi: 'Vui lòng phản hồi nhanh chóng yêu cầu này.',
    phonetic: '/ˈprɑːmptli/',
    topicId: emailTopic.id,
    order: 4,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We need to address this issue _____.',
        questionVi: 'Chúng ta cần giải quyết vấn đề này _____.',
        options: ['promptly', 'prompt', 'prompted', 'prompting'],
        correctAnswer: 'promptly',
      },
    ],
  });

  await createWord({
    word: 'acknowledge',
    meaning: 'to accept or admit the existence or truth of',
    meaningVi: 'xác nhận, thừa nhận',
    example: 'Please acknowledge receipt of this email.',
    exampleVi: 'Vui lòng xác nhận đã nhận được email này.',
    phonetic: '/əkˈnɑːlɪdʒ/',
    topicId: emailTopic.id,
    order: 5,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'I _____ your concerns about the timeline.',
        questionVi: 'Tôi _____ mối lo ngại của bạn về thời gian.',
        options: ['acknowledge', 'acknowledging', 'acknowledged', 'acknowledges'],
        correctAnswer: 'acknowledge',
      },
    ],
  });

  // Day 2: Making Requests
  await createWord({
    word: 'urgent',
    meaning: 'requiring immediate action or attention',
    meaningVi: 'khẩn cấp, gấp',
    example: 'This is an urgent matter that needs immediate attention.',
    exampleVi: 'Đây là vấn đề khẩn cấp cần được xử lý ngay lập tức.',
    phonetic: '/ˈɜːrdʒənt/',
    topicId: emailTopic.id,
    order: 6,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'This is an _____ request.',
        questionVi: 'Đây là một yêu cầu _____.',
        options: ['urgent', 'urgency', 'urgently', 'urge'],
        correctAnswer: 'urgent',
      },
    ],
  });

  await createWord({
    word: 'clarification',
    meaning: 'the action of making something clear or easier to understand',
    meaningVi: 'sự làm rõ, giải thích',
    example: 'I need clarification on the project requirements.',
    exampleVi: 'Tôi cần làm rõ về yêu cầu của dự án.',
    phonetic: '/ˌklærəfɪˈkeɪʃn/',
    topicId: emailTopic.id,
    order: 7,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Could you provide some _____ on this point?',
        questionVi: 'Bạn có thể cung cấp _____ về điểm này không?',
        options: ['clarification', 'clarify', 'clear', 'clearly'],
        correctAnswer: 'clarification',
      },
    ],
  });

  await createWord({
    word: 'follow up',
    meaning: 'to pursue or investigate something further',
    meaningVi: 'theo dõi, nhắc lại',
    example: "I'm following up on my previous email from last week.",
    exampleVi: 'Tôi đang theo dõi email trước của tôi từ tuần trước.',
    phonetic: '/ˈfɑːloʊ ʌp/',
    topicId: emailTopic.id,
    order: 8,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: "I'm _____ on our meeting yesterday.",
        questionVi: 'Tôi đang _____ cuộc họp hôm qua của chúng ta.',
        options: ['following up', 'follow up', 'followed up', 'follows up'],
        correctAnswer: 'following up',
      },
    ],
  });

  await createWord({
    word: 'deadline',
    meaning: 'the latest time or date by which something should be completed',
    meaningVi: 'hạn chót, thời hạn',
    example: 'The deadline for this project is Friday, March 15th.',
    exampleVi: 'Hạn chót cho dự án này là thứ Sáu, ngày 15 tháng 3.',
    phonetic: '/ˈdedlaɪn/',
    topicId: emailTopic.id,
    order: 9,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Can we extend the _____ by one week?',
        questionVi: 'Chúng ta có thể gia hạn _____ thêm một tuần không?',
        options: ['deadline', 'dead', 'line', 'deadlines'],
        correctAnswer: 'deadline',
      },
    ],
  });

  await createWord({
    word: 'priority',
    meaning: 'something that is more important than other things',
    meaningVi: 'ưu tiên',
    example: 'This task should be our top priority.',
    exampleVi: 'Nhiệm vụ này nên là ưu tiên hàng đầu của chúng ta.',
    phonetic: '/praɪˈɔːrəti/',
    topicId: emailTopic.id,
    order: 10,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Customer satisfaction is our main _____.',
        questionVi: 'Sự hài lòng của khách hàng là _____ chính của chúng tôi.',
        options: ['priority', 'prior', 'prioritize', 'priorities'],
        correctAnswer: 'priority',
      },
    ],
  });

  // Day 3: Apologizing & Explaining
  await createWord({
    word: 'apologize',
    meaning: 'to express regret for something one has done wrong',
    meaningVi: 'xin lỗi',
    example: 'I apologize for the delay in responding to your email.',
    exampleVi: 'Tôi xin lỗi vì đã trễ trong việc trả lời email của bạn.',
    phonetic: '/əˈpɑːlədʒaɪz/',
    topicId: emailTopic.id,
    order: 11,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'I _____ for any inconvenience caused.',
        questionVi: 'Tôi _____ vì bất kỳ sự bất tiện nào gây ra.',
        options: ['apologize', 'apology', 'apologized', 'apologizing'],
        correctAnswer: 'apologize',
      },
    ],
  });

  await createWord({
    word: 'inconvenience',
    meaning: 'trouble or difficulty caused to someone',
    meaningVi: 'sự bất tiện',
    example: 'We apologize for any inconvenience this may have caused.',
    exampleVi: 'Chúng tôi xin lỗi vì bất kỳ sự bất tiện nào điều này có thể gây ra.',
    phonetic: '/ˌɪnkənˈviːniəns/',
    topicId: emailTopic.id,
    order: 12,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Sorry for the _____.',
        questionVi: 'Xin lỗi vì sự _____.',
        options: ['inconvenience', 'inconvenient', 'conveniently', 'convenience'],
        correctAnswer: 'inconvenience',
      },
    ],
  });

  await createWord({
    word: 'oversight',
    meaning: 'an unintentional failure to notice or do something',
    meaningVi: 'sự sơ xuất, thiếu sót',
    example: 'This was an oversight on my part.',
    exampleVi: 'Đây là một sự sơ xuất từ phía tôi.',
    phonetic: '/ˈoʊvərsaɪt/',
    topicId: emailTopic.id,
    order: 13,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'The mistake was due to an _____.',
        questionVi: 'Lỗi này là do một _____.',
        options: ['oversight', 'oversee', 'oversaw', 'overseeing'],
        correctAnswer: 'oversight',
      },
    ],
  });

  await createWord({
    word: 'mishap',
    meaning: 'an unlucky accident or mistake',
    meaningVi: 'sự cố nhỏ, rủi ro',
    example: 'Due to a technical mishap, the meeting was postponed.',
    exampleVi: 'Do một sự cố kỹ thuật, cuộc họp đã bị hoãn lại.',
    phonetic: '/ˈmɪshæp/',
    topicId: emailTopic.id,
    order: 14,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We experienced a minor _____ yesterday.',
        questionVi: 'Chúng tôi gặp một _____ nhỏ ngày hôm qua.',
        options: ['mishap', 'mishaps', 'mishapping', 'mishapped'],
        correctAnswer: 'mishap',
      },
    ],
  });

  await createWord({
    word: 'rectify',
    meaning: 'to correct something or make it right',
    meaningVi: 'sửa chữa, khắc phục',
    example: 'We will rectify this issue immediately.',
    exampleVi: 'Chúng tôi sẽ khắc phục vấn đề này ngay lập tức.',
    phonetic: '/ˈrektɪfaɪ/',
    topicId: emailTopic.id,
    order: 15,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We need to _____ the error as soon as possible.',
        questionVi: 'Chúng ta cần _____ lỗi càng sớm càng tốt.',
        options: ['rectify', 'rectified', 'rectifying', 'rectifies'],
        correctAnswer: 'rectify',
      },
    ],
  });

  // =====================================================
  // WEEK 2: MEETINGS
  // =====================================================
  
  const meetingTopic = await prisma.topic.create({
    data: {
      name: 'Meetings',
      nameVi: 'Họp Hành',
      description: 'Essential vocabulary for business meetings',
      icon: '🤝',
      order: 2,
    },
  });

  // Day 4: Scheduling Meetings
  await createWord({
    word: 'schedule',
    meaning: 'to arrange for something to happen at a particular time',
    meaningVi: 'lên lịch, sắp xếp',
    example: "Let's schedule a meeting for next Tuesday.",
    exampleVi: 'Hãy lên lịch một cuộc họp vào thứ Ba tuần sau.',
    phonetic: '/ˈskedʒuːl/',
    topicId: meetingTopic.id,
    order: 16,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Can we _____ a call for tomorrow?',
        questionVi: 'Chúng ta có thể _____ một cuộc gọi cho ngày mai không?',
        options: ['schedule', 'scheduled', 'scheduling', 'schedules'],
        correctAnswer: 'schedule',
      },
    ],
  });

  await createWord({
    word: 'availability',
    meaning: 'the state of being free to do something',
    meaningVi: 'sự có mặt, thời gian rảnh',
    example: 'Please check your availability for next week.',
    exampleVi: 'Vui lòng kiểm tra lịch rảnh của bạn cho tuần sau.',
    phonetic: '/əˌveɪləˈbɪləti/',
    topicId: meetingTopic.id,
    order: 17,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'What is your _____ this week?',
        questionVi: '_____ của bạn tuần này như thế nào?',
        options: ['availability', 'available', 'availably', 'availabilities'],
        correctAnswer: 'availability',
      },
    ],
  });

  await createWord({
    word: 'tentative',
    meaning: 'not certain or fixed; provisional',
    meaningVi: 'tạm thời, chưa chắc chắn',
    example: 'I have a tentative meeting scheduled at 2 PM.',
    exampleVi: 'Tôi có một cuộc họp tạm thời được lên lịch lúc 2 giờ chiều.',
    phonetic: '/ˈtentətɪv/',
    topicId: meetingTopic.id,
    order: 18,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'This is just a _____ plan for now.',
        questionVi: 'Đây chỉ là một kế hoạch _____ hiện tại.',
        options: ['tentative', 'tentatively', 'tentativeness', 'tentatives'],
        correctAnswer: 'tentative',
      },
    ],
  });

  await createWord({
    word: 'reschedule',
    meaning: 'to change the time of a planned event',
    meaningVi: 'dời lịch, sắp xếp lại',
    example: 'Can we reschedule our meeting to next week?',
    exampleVi: 'Chúng ta có thể dời cuộc họp sang tuần sau không?',
    phonetic: '/ˌriːˈskedʒuːl/',
    topicId: meetingTopic.id,
    order: 19,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'I need to _____ our appointment.',
        questionVi: 'Tôi cần _____ cuộc hẹn của chúng ta.',
        options: ['reschedule', 'rescheduled', 'rescheduling', 'reschedules'],
        correctAnswer: 'reschedule',
      },
    ],
  });

  await createWord({
    word: 'agenda',
    meaning: 'a list of items to be discussed at a meeting',
    meaningVi: 'chương trình họp, nghị sự',
    example: "Here's the agenda for today's meeting.",
    exampleVi: 'Đây là chương trình họp hôm nay.',
    phonetic: '/əˈdʒendə/',
    topicId: meetingTopic.id,
    order: 20,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Please review the meeting _____ before we start.',
        questionVi: 'Vui lòng xem lại _____ cuộc họp trước khi bắt đầu.',
        options: ['agenda', 'agendas', 'agendum', 'agent'],
        correctAnswer: 'agenda',
      },
    ],
  });

  // Day 5: During Meetings
  await createWord({
    word: 'proceed',
    meaning: 'to continue with an action or process',
    meaningVi: 'tiếp tục, tiến hành',
    example: "Let's proceed to the next item on the agenda.",
    exampleVi: 'Hãy tiếp tục với mục tiếp theo trong chương trình họp.',
    phonetic: '/prəˈsiːd/',
    topicId: meetingTopic.id,
    order: 21,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We can _____ with the presentation now.',
        questionVi: 'Chúng ta có thể _____ bản trình bày ngay bây giờ.',
        options: ['proceed', 'proceeded', 'proceeding', 'proceeds'],
        correctAnswer: 'proceed',
      },
    ],
  });

  await createWord({
    word: 'interrupt',
    meaning: 'to stop someone from speaking by saying or doing something',
    meaningVi: 'ngắt lời, làm gián đoạn',
    example: 'Sorry to interrupt, but I have a question.',
    exampleVi: 'Xin lỗi vì ngắt lời, nhưng tôi có một câu hỏi.',
    phonetic: '/ˌɪntəˈrʌpt/',
    topicId: meetingTopic.id,
    order: 22,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'I apologize for _____ the meeting.',
        questionVi: 'Tôi xin lỗi vì _____ cuộc họp.',
        options: ['interrupting', 'interrupt', 'interrupted', 'interrupts'],
        correctAnswer: 'interrupting',
      },
    ],
  });

  await createWord({
    word: 'elaborate',
    meaning: 'to give more details or explain something more fully',
    meaningVi: 'giải thích chi tiết, trình bày rõ hơn',
    example: 'Could you elaborate on that point?',
    exampleVi: 'Bạn có thể giải thích chi tiết hơn về điểm đó không?',
    phonetic: '/ɪˈlæbəreɪt/',
    topicId: meetingTopic.id,
    order: 23,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Please _____ on your proposal.',
        questionVi: 'Vui lòng _____ về đề xuất của bạn.',
        options: ['elaborate', 'elaborated', 'elaborating', 'elaborates'],
        correctAnswer: 'elaborate',
      },
    ],
  });

  await createWord({
    word: 'consensus',
    meaning: 'general agreement among a group of people',
    meaningVi: 'sự đồng thuận, sự nhất trí',
    example: "Let's try to reach a consensus on this issue.",
    exampleVi: 'Hãy cố gắng đạt được sự đồng thuận về vấn đề này.',
    phonetic: '/kənˈsensəs/',
    topicId: meetingTopic.id,
    order: 24,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We need to find a _____ before moving forward.',
        questionVi: 'Chúng ta cần tìm một _____ trước khi tiếp tục.',
        options: ['consensus', 'consensuses', 'consensual', 'consent'],
        correctAnswer: 'consensus',
      },
    ],
  });

  await createWord({
    word: 'action item',
    meaning: 'a specific task that needs to be completed',
    meaningVi: 'nhiệm vụ cần làm, việc cần thực hiện',
    example: "Here are the action items from today's meeting.",
    exampleVi: 'Đây là các nhiệm vụ cần làm từ cuộc họp hôm nay.',
    phonetic: '/ˈækʃən ˌaɪtəm/',
    topicId: meetingTopic.id,
    order: 25,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Please complete all _____ by Friday.',
        questionVi: 'Vui lòng hoàn thành tất cả _____ trước thứ Sáu.',
        options: ['action items', 'actions item', 'action item', 'actions items'],
        correctAnswer: 'action items',
      },
    ],
  });

  // =====================================================
  // WEEK 3: PROJECT MANAGEMENT
  // =====================================================
  
  const projectTopic = await prisma.topic.create({
    data: {
      name: 'Project Management',
      nameVi: 'Quản Lý Dự Án',
      description: 'Vocabulary for managing projects effectively',
      icon: '📊',
      order: 3,
    },
  });

  // Day 7: Planning
  await createWord({
    word: 'milestone',
    meaning: 'an important stage or event in the development of something',
    meaningVi: 'cột mốc quan trọng',
    example: "We've reached an important milestone in the project.",
    exampleVi: 'Chúng ta đã đạt được một cột mốc quan trọng trong dự án.',
    phonetic: '/ˈmaɪlstoʊn/',
    topicId: projectTopic.id,
    order: 26,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Completing the prototype is a major _____.',
        questionVi: 'Hoàn thành nguyên mẫu là một _____ lớn.',
        options: ['milestone', 'milestones', 'mile', 'stone'],
        correctAnswer: 'milestone',
      },
    ],
  });

  await createWord({
    word: 'deliverable',
    meaning: 'a specific output or result that must be produced',
    meaningVi: 'sản phẩm bàn giao, kết quả cần đạt',
    example: 'The final deliverables are due next month.',
    exampleVi: 'Các sản phẩm cuối cùng cần bàn giao vào tháng tới.',
    phonetic: '/dɪˈlɪvərəbl/',
    topicId: projectTopic.id,
    order: 27,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'What are the key _____ for this sprint?',
        questionVi: 'Các _____ chính cho sprint này là gì?',
        options: ['deliverables', 'deliverable', 'deliver', 'delivered'],
        correctAnswer: 'deliverables',
      },
    ],
  });

  await createWord({
    word: 'scope',
    meaning: 'the extent or range of something',
    meaningVi: 'phạm vi',
    example: 'This feature is out of scope for the current project.',
    exampleVi: 'Tính năng này nằm ngoài phạm vi của dự án hiện tại.',
    phonetic: '/skoʊp/',
    topicId: projectTopic.id,
    order: 28,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We need to define the project _____.',
        questionVi: 'Chúng ta cần xác định _____ dự án.',
        options: ['scope', 'scopes', 'scoping', 'scoped'],
        correctAnswer: 'scope',
      },
    ],
  });

  await createWord({
    word: 'stakeholder',
    meaning: 'a person with an interest or concern in something',
    meaningVi: 'bên liên quan, người có quyền lợi',
    example: 'We need approval from all key stakeholders.',
    exampleVi: 'Chúng ta cần sự chấp thuận từ tất cả các bên liên quan chính.',
    phonetic: '/ˈsteɪkhoʊldər/',
    topicId: projectTopic.id,
    order: 29,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'The _____ meeting is scheduled for Monday.',
        questionVi: 'Cuộc họp _____ được lên lịch vào thứ Hai.',
        options: ['stakeholder', 'stakeholders', 'stake', 'holder'],
        correctAnswer: 'stakeholder',
      },
    ],
  });

  await createWord({
    word: 'roadmap',
    meaning: 'a plan or strategy showing the steps needed to achieve a goal',
    meaningVi: 'lộ trình, kế hoạch chiến lược',
    example: "Here's our product roadmap for the next quarter.",
    exampleVi: 'Đây là lộ trình sản phẩm của chúng ta cho quý tới.',
    phonetic: '/ˈroʊdmæp/',
    topicId: projectTopic.id,
    order: 30,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'The product _____ shows our priorities.',
        questionVi: '_____ sản phẩm cho thấy ưu tiên của chúng ta.',
        options: ['roadmap', 'road', 'map', 'roadmaps'],
        correctAnswer: 'roadmap',
      },
    ],
  });

  // Day 8: Progress Updates
  await createWord({
    word: 'on track',
    meaning: 'making progress as planned',
    meaningVi: 'đúng tiến độ, theo đúng kế hoạch',
    example: 'The project is on track to finish by the deadline.',
    exampleVi: 'Dự án đang đúng tiến độ để hoàn thành trước hạn chót.',
    phonetic: '/ɑːn træk/',
    topicId: projectTopic.id,
    order: 31,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: "We're still _____ to meet our goals.",
        questionVi: 'Chúng ta vẫn _____ để đạt được mục tiêu.',
        options: ['on track', 'in track', 'at track', 'by track'],
        correctAnswer: 'on track',
      },
    ],
  });

  await createWord({
    word: 'behind schedule',
    meaning: 'later than planned',
    meaningVi: 'chậm tiến độ, trễ hơn kế hoạch',
    example: "We're two weeks behind schedule on this project.",
    exampleVi: 'Chúng ta đang chậm tiến độ hai tuần trong dự án này.',
    phonetic: '/bɪˈhaɪnd ˈskedʒuːl/',
    topicId: projectTopic.id,
    order: 32,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'The project is running _____.',
        questionVi: 'Dự án đang _____ tiến độ.',
        options: ['behind schedule', 'behind the schedule', 'after schedule', 'late schedule'],
        correctAnswer: 'behind schedule',
      },
    ],
  });

  await createWord({
    word: 'blocker',
    meaning: 'something that prevents progress',
    meaningVi: 'vấn đề cản trở, rào cản',
    example: 'We have a blocker in the testing phase.',
    exampleVi: 'Chúng ta có một vấn đề cản trở ở giai đoạn kiểm thử.',
    phonetic: '/ˈblɑːkər/',
    topicId: projectTopic.id,
    order: 33,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'What are the current _____ for the team?',
        questionVi: '_____ hiện tại của nhóm là gì?',
        options: ['blockers', 'blocker', 'block', 'blocking'],
        correctAnswer: 'blockers',
      },
    ],
  });

  await createWord({
    word: 'status update',
    meaning: 'information about the current situation or progress',
    meaningVi: 'cập nhật tình hình, báo cáo tiến độ',
    example: 'Please send a status update by end of day.',
    exampleVi: 'Vui lòng gửi báo cáo tiến độ trước cuối ngày.',
    phonetic: '/ˈsteɪtəs ˈʌpdeɪt/',
    topicId: projectTopic.id,
    order: 34,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We need a weekly _____ from each team.',
        questionVi: 'Chúng ta cần một _____ hàng tuần từ mỗi nhóm.',
        options: ['status update', 'update status', 'status', 'update'],
        correctAnswer: 'status update',
      },
    ],
  });

  await createWord({
    word: 'bottleneck',
    meaning: 'a point where progress is slowed or stopped',
    meaningVi: 'điểm nghẽn, nút thắt cổ chai',
    example: 'The approval process is a major bottleneck.',
    exampleVi: 'Quy trình phê duyệt là một điểm nghẽn lớn.',
    phonetic: '/ˈbɑːtlnek/',
    topicId: projectTopic.id,
    order: 35,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We need to identify and remove any _____.',
        questionVi: 'Chúng ta cần xác định và loại bỏ bất kỳ _____ nào.',
        options: ['bottlenecks', 'bottleneck', 'bottle', 'neck'],
        correctAnswer: 'bottlenecks',
      },
    ],
  });

  // =====================================================
  // WEEK 4: COLLABORATION
  // =====================================================
  
  const collaborationTopic = await prisma.topic.create({
    data: {
      name: 'Collaboration & Teamwork',
      nameVi: 'Hợp Tác & Làm Việc Nhóm',
      description: 'Vocabulary for effective team collaboration',
      icon: '👥',
      order: 4,
    },
  });

  // Day 10: Teamwork
  await createWord({
    word: 'collaborate',
    meaning: 'to work jointly with others',
    meaningVi: 'hợp tác, cộng tác',
    example: "Let's collaborate on this project together.",
    exampleVi: 'Hãy cùng hợp tác trong dự án này.',
    phonetic: '/kəˈlæbəreɪt/',
    topicId: collaborationTopic.id,
    order: 36,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We need to _____ more effectively.',
        questionVi: 'Chúng ta cần _____ hiệu quả hơn.',
        options: ['collaborate', 'collaboration', 'collaborative', 'collaborating'],
        correctAnswer: 'collaborate',
      },
    ],
  });

  await createWord({
    word: 'delegate',
    meaning: 'to give a task or responsibility to someone else',
    meaningVi: 'ủy quyền, giao việc',
    example: "I'll delegate this task to Sarah.",
    exampleVi: 'Tôi sẽ giao việc này cho Sarah.',
    phonetic: '/ˈdelɪɡeɪt/',
    topicId: collaborationTopic.id,
    order: 37,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We should _____ some tasks to junior members.',
        questionVi: 'Chúng ta nên _____ một số công việc cho thành viên junior.',
        options: ['delegate', 'delegated', 'delegating', 'delegation'],
        correctAnswer: 'delegate',
      },
    ],
  });

  await createWord({
    word: 'coordinate',
    meaning: 'to organize different elements to work together effectively',
    meaningVi: 'phối hợp, điều phối',
    example: 'We need to coordinate our efforts across teams.',
    exampleVi: 'Chúng ta cần phối hợp nỗ lực giữa các nhóm.',
    phonetic: '/koʊˈɔːrdɪneɪt/',
    topicId: collaborationTopic.id,
    order: 38,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Please _____ with the marketing team.',
        questionVi: 'Vui lòng _____ với nhóm marketing.',
        options: ['coordinate', 'coordinated', 'coordinating', 'coordination'],
        correctAnswer: 'coordinate',
      },
    ],
  });

  await createWord({
    word: 'brainstorm',
    meaning: 'to generate ideas through group discussion',
    meaningVi: 'động não, đưa ra ý tưởng',
    example: "Let's brainstorm some solutions for this problem.",
    exampleVi: 'Hãy động não một số giải pháp cho vấn đề này.',
    phonetic: '/ˈbreɪnstɔːrm/',
    topicId: collaborationTopic.id,
    order: 39,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We should _____ new features for the app.',
        questionVi: 'Chúng ta nên _____ các tính năng mới cho ứng dụng.',
        options: ['brainstorm', 'brainstormed', 'brainstorming', 'brainstorms'],
        correctAnswer: 'brainstorm',
      },
    ],
  });

  await createWord({
    word: 'synergy',
    meaning: 'the combined power of a group working together',
    meaningVi: 'sự kết hợp hiệu quả, hiệu ứng cộng hưởng',
    example: 'Great synergy between the development and design teams!',
    exampleVi: 'Sự phối hợp tuyệt vời giữa nhóm phát triển và thiết kế!',
    phonetic: '/ˈsɪnərdʒi/',
    topicId: collaborationTopic.id,
    order: 40,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'The _____ between teams is impressive.',
        questionVi: '_____ giữa các nhóm thật ấn tượng.',
        options: ['synergy', 'synergies', 'synergistic', 'synergize'],
        correctAnswer: 'synergy',
      },
    ],
  });

  // Day 11: Feedback
  await createWord({
    word: 'constructive',
    meaning: 'helpful and intended to improve something',
    meaningVi: 'mang tính xây dựng',
    example: 'Thank you for the constructive feedback.',
    exampleVi: 'Cảm ơn về phản hồi mang tính xây dựng.',
    phonetic: '/kənˈstrʌktɪv/',
    topicId: collaborationTopic.id,
    order: 41,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Please provide _____ criticism.',
        questionVi: 'Vui lòng đưa ra lời phê bình _____.',
        options: ['constructive', 'construct', 'construction', 'constructively'],
        correctAnswer: 'constructive',
      },
    ],
  });

  await createWord({
    word: 'insight',
    meaning: 'a deep understanding of something',
    meaningVi: 'cái nhìn sâu sắc, hiểu biết',
    example: "That's a valuable insight into the problem.",
    exampleVi: 'Đó là một cái nhìn sâu sắc có giá trị về vấn đề.',
    phonetic: '/ˈɪnsaɪt/',
    topicId: collaborationTopic.id,
    order: 42,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Your _____ was very helpful.',
        questionVi: '_____ của bạn rất hữu ích.',
        options: ['insight', 'insights', 'insightful', 'insighting'],
        correctAnswer: 'insight',
      },
    ],
  });

  await createWord({
    word: 'revise',
    meaning: 'to change or modify something to improve it',
    meaningVi: 'chỉnh sửa, xem xét lại',
    example: 'Please revise the document based on the feedback.',
    exampleVi: 'Vui lòng chỉnh sửa tài liệu dựa trên phản hồi.',
    phonetic: '/rɪˈvaɪz/',
    topicId: collaborationTopic.id,
    order: 43,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We need to _____ our strategy.',
        questionVi: 'Chúng ta cần _____ chiến lược của mình.',
        options: ['revise', 'revised', 'revising', 'revision'],
        correctAnswer: 'revise',
      },
    ],
  });

  await createWord({
    word: 'refine',
    meaning: 'to improve something by making small changes',
    meaningVi: 'tinh chỉnh, hoàn thiện',
    example: "Let's refine our approach based on the results.",
    exampleVi: 'Hãy tinh chỉnh cách tiếp cận dựa trên kết quả.',
    phonetic: '/rɪˈfaɪn/',
    topicId: collaborationTopic.id,
    order: 44,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We can _____ this process further.',
        questionVi: 'Chúng ta có thể _____ quy trình này hơn nữa.',
        options: ['refine', 'refined', 'refining', 'refinement'],
        correctAnswer: 'refine',
      },
    ],
  });

  await createWord({
    word: 'iterate',
    meaning: 'to repeat a process to make improvements',
    meaningVi: 'lặp lại, cải tiến dần dần',
    example: "We'll iterate on the design based on user feedback.",
    exampleVi: 'Chúng ta sẽ cải tiến thiết kế dựa trên phản hồi người dùng.',
    phonetic: '/ˈɪtəreɪt/',
    topicId: collaborationTopic.id,
    order: 45,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'We need to _____ quickly on this feature.',
        questionVi: 'Chúng ta cần _____ nhanh chóng trên tính năng này.',
        options: ['iterate', 'iterated', 'iterating', 'iteration'],
        correctAnswer: 'iterate',
      },
    ],
  });

  // =====================================================
  // WEEK 5: PRESENTATIONS & REPORTS
  // =====================================================
  
  const presentationTopic = await prisma.topic.create({
    data: {
      name: 'Presentations & Reports',
      nameVi: 'Thuyết Trình & Báo Cáo',
      description: 'Vocabulary for delivering presentations and writing reports',
      icon: '📊',
      order: 5,
    },
  });

  // Day 13: Presenting
  await createWord({
    word: 'overview',
    meaning: 'a general summary or description',
    meaningVi: 'tổng quan, khái quát',
    example: "I'll start with an overview of the project.",
    exampleVi: 'Tôi sẽ bắt đầu với một tổng quan về dự án.',
    phonetic: '/ˈoʊvərvjuː/',
    topicId: presentationTopic.id,
    order: 46,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Let me give you an _____ of the situation.',
        questionVi: 'Để tôi đưa ra một _____ về tình hình.',
        options: ['overview', 'view', 'over', 'overviews'],
        correctAnswer: 'overview',
      },
    ],
  });

  await createWord({
    word: 'highlight',
    meaning: 'to emphasize or draw attention to something important',
    meaningVi: 'làm nổi bật, nhấn mạnh',
    example: 'I want to highlight our key achievements this quarter.',
    exampleVi: 'Tôi muốn nhấn mạnh những thành tựu chính của chúng ta trong quý này.',
    phonetic: '/ˈhaɪlaɪt/',
    topicId: presentationTopic.id,
    order: 47,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: "Let's _____ the most important points.",
        questionVi: 'Hãy _____ những điểm quan trọng nhất.',
        options: ['highlight', 'highlighted', 'highlighting', 'highlights'],
        correctAnswer: 'highlight',
      },
    ],
  });

  await createWord({
    word: 'demonstrate',
    meaning: 'to show clearly how something works or is done',
    meaningVi: 'chứng minh, trình diễn',
    example: "Let me demonstrate how the new feature works.",
    exampleVi: 'Để tôi trình diễn cách tính năng mới hoạt động.',
    phonetic: '/ˈdemənstreɪt/',
    topicId: presentationTopic.id,
    order: 48,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Can you _____ the process?',
        questionVi: 'Bạn có thể _____ quy trình không?',
        options: ['demonstrate', 'demonstrated', 'demonstrating', 'demonstration'],
        correctAnswer: 'demonstrate',
      },
    ],
  });

  await createWord({
    word: 'findings',
    meaning: 'information discovered as a result of research or investigation',
    meaningVi: 'phát hiện, kết quả nghiên cứu',
    example: 'Here are our key findings from the user research.',
    exampleVi: 'Đây là những phát hiện chính từ nghiên cứu người dùng.',
    phonetic: '/ˈfaɪndɪŋz/',
    topicId: presentationTopic.id,
    order: 49,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'The research _____ are very interesting.',
        questionVi: '_____ nghiên cứu rất thú vị.',
        options: ['findings', 'finding', 'find', 'found'],
        correctAnswer: 'findings',
      },
    ],
  });

  await createWord({
    word: 'summarize',
    meaning: 'to give a brief statement of the main points',
    meaningVi: 'tóm tắt',
    example: 'To summarize, we exceeded all our targets this quarter.',
    exampleVi: 'Tóm lại, chúng ta đã vượt qua tất cả các mục tiêu trong quý này.',
    phonetic: '/ˈsʌməraɪz/',
    topicId: presentationTopic.id,
    order: 50,
    level: Level.INTERMEDIATE,
    exercises: [
      {
        type: ExerciseType.MULTIPLE_CHOICE,
        question: 'Can you _____ the main points?',
        questionVi: 'Bạn có thể _____ các điểm chính không?',
        options: ['summarize', 'summary', 'summarized', 'summarizing'],
        correctAnswer: 'summarize',
      },
    ],
  });

  console.log('✅ Seed completed successfully!');
  console.log(`📚 Created ${await prisma.vocabulary.count()} vocabulary words`);
  console.log(`📝 Created ${await prisma.exercise.count()} exercises`);
  console.log(`🎯 Created ${await prisma.topic.count()} topics`);
}

// Helper function to create vocabulary with exercises
async function createWord(data: {
  word: string;
  meaning: string;
  meaningVi: string;
  example: string;
  exampleVi: string;
  phonetic: string;
  topicId: string;
  order: number;
  level?: any;
  exercises: Array<{
    type: any;
    question: string;
    questionVi: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
  }>;
}) {
  const { exercises, level, ...vocabData } = data;

  const vocabulary = await prisma.vocabulary.create({
    data: {
      ...vocabData,
      level: level || Level.BEGINNER,
      audioUrl: `/audio/${data.word.toLowerCase().replace(/ /g, '-')}.mp3`,
    },
  });

  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: {
        vocabularyId: vocabulary.id,
        ...exercise,
      },
    });
  }

  return vocabulary;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });