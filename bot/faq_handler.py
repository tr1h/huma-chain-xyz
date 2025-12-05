"""
FAQ Handler for Solana Tamagotchi Community Bot
Автоматические ответы на частые вопросы в группе
"""

import json
import re
from typing import Optional, Tuple

class FAQHandler:
    def __init__(self, faq_file='bot/faq_data.json'):
        """Initialize FAQ handler with data from JSON file"""
        with open(faq_file, 'r', encoding='utf-8') as f:
            self.data = json.load(f)
        
        self.faq = self.data['faq']
        self.spam_filters = self.data['spam_filters']
        self.default_response = self.data['default_response']
    
    def detect_language(self, text: str) -> str:
        """Detect if message is in Russian or English"""
        # Simple heuristic: if contains Cyrillic characters, it's Russian
        cyrillic_pattern = re.compile('[а-яА-ЯёЁ]')
        return 'ru' if cyrillic_pattern.search(text) else 'en'
    
    def check_spam(self, text: str) -> Optional[str]:
        """
        Check if message matches spam filter patterns
        Returns auto-response if spam detected, None otherwise
        """
        text_lower = text.lower()
        lang = self.detect_language(text)
        
        for spam_filter in self.spam_filters:
            for keyword in spam_filter['keywords']:
                if keyword.lower() in text_lower:
                    response_key = f'response_{lang}'
                    return spam_filter.get(response_key, spam_filter['response_en'])
        
        return None
    
    def find_answer(self, text: str) -> Optional[str]:
        """
        Find FAQ answer based on keywords in message
        Returns answer if found, None otherwise
        """
        text_lower = text.lower()
        lang = self.detect_language(text)
        
        # Check each FAQ entry
        best_match = None
        max_matches = 0
        
        for faq_entry in self.faq:
            matches = 0
            for keyword in faq_entry['keywords']:
                if keyword.lower() in text_lower:
                    matches += 1
            
            # If this entry has more keyword matches, it's a better match
            if matches > max_matches:
                max_matches = matches
                best_match = faq_entry
        
        # Return answer if we found at least one keyword match
        if best_match and max_matches > 0:
            answer_key = f'answer_{lang}'
            return best_match.get(answer_key, best_match['answer_en'])
        
        return None
    
    def get_default_response(self, lang: str = 'en') -> str:
        """Get default response when no FAQ match found"""
        return self.default_response.get(lang, self.default_response['en'])
    
    def process_message(self, text: str, auto_respond: bool = True) -> Tuple[str, str]:
        """
        Process a message and return (response_type, response_text)
        
        response_type can be:
        - 'spam': Message matches spam filter
        - 'faq': Message matches FAQ
        - 'none': No match found (don't respond)
        - 'default': No match but help needed
        
        Returns:
            Tuple[str, str]: (response_type, response_text)
        """
        if not text or len(text) < 5:
            return ('none', '')
        
        # First check for spam patterns
        spam_response = self.check_spam(text)
        if spam_response:
            return ('spam', spam_response)
        
        # Then check for FAQ matches
        faq_answer = self.find_answer(text)
        if faq_answer:
            return ('faq', faq_answer)
        
        # Check if message is a question (contains ?, how, what, когда, как, что)
        question_indicators = ['?', 'how', 'what', 'when', 'where', 'why', 'can', 'is', 
                              'как', 'что', 'когда', 'где', 'почему', 'можно']
        
        is_question = any(indicator in text.lower() for indicator in question_indicators)
        
        if is_question and auto_respond:
            lang = self.detect_language(text)
            return ('default', self.get_default_response(lang))
        
        return ('none', '')


# Testing
if __name__ == '__main__':
    handler = FAQHandler()
    
    test_messages = [
        "Is the token I have in the game 1:1 when launch?",
        "How to mint NFT?",
        "Partnership offer for AMA",
        "как заработать TAMA?",
        "адрес контракта токена?",
        "Привет, как дела?",
        "When mainnet?"
    ]
    
    print("Testing FAQ Handler:\n")
    for msg in test_messages:
        response_type, response = handler.process_message(msg)
        print(f"Message: {msg}")
        print(f"Type: {response_type}")
        if response:
            print(f"Response: {response[:100]}...")
        print("-" * 80 + "\n")

